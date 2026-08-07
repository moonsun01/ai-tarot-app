import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const TOPIC_LABELS: Record<string, string> = {
  love:   '연애/속마음',
  career: '학업/진로',
  social: '대인관계/팀플',
  luck:   '오늘의 총운',
};

const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
const MAX_RETRIES = 2;
const TIMEOUT_MS = 25_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms),
    ),
  ]);
}

function logError(label: string, err: unknown) {
  const e = err as Record<string, unknown>;
  console.error(`\n[/api/tarot] ══ ${label} ══`);
  console.error('  type    :', err?.constructor?.name ?? typeof err);
  console.error('  status  :', e['status'] ?? e['statusCode'] ?? 'N/A');
  console.error('  code    :', e['code'] ?? 'N/A');
  console.error('  message :', e['message'] ?? String(err));
  if (e['errorDetails']) console.error('  details :', JSON.stringify(e['errorDetails']));
  if (e['stack']) {
    console.error('  stack   :');
    String(e['stack']).split('\n').slice(0, 6).forEach(l => console.error('   ', l));
  }
  console.error('');
}

async function callGemini(
  ai: GoogleGenAI,
  prompt: string,
): Promise<string> {
  let lastErr: unknown;

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      console.log(`[/api/tarot] model=${model} attempt ${attempt}/${MAX_RETRIES + 1}`);
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction:
                '당신은 신비롭고 다정한 AI 타로마스터입니다. 사용자가 고른 주제와 선택한 타로 카드 3장의 명칭을 바탕으로 각 카드의 의미와 종합적인 해석, 그리고 따뜻한 조언을 감성적인 한국어로 작성해 주세요.',
              responseMimeType: 'application/json',
              maxOutputTokens: 800,
            },
          }),
          TIMEOUT_MS,
        );
        console.log(`[/api/tarot] model=${model} attempt ${attempt} succeeded`);
        return response.text ?? '';
      } catch (err) {
        lastErr = err;
        const status = (err as Record<string, unknown>)['status'];
        logError(`model=${model} attempt ${attempt} failed`, err);
        // 429 quota exhausted — skip remaining retries and try next model
        if (status === 429) {
          console.log(`[/api/tarot] quota exceeded for ${model}, trying next model…`);
          break;
        }
        if (attempt <= MAX_RETRIES) {
          const delay = attempt * 1500;
          console.log(`[/api/tarot] retrying in ${delay}ms…`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
  }

  throw lastErr;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, cards } = (await req.json()) as {
      topic: string;
      cards: { name: string; korean: string; keyword: string }[];
    };

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const cardList = cards
      .map((c, i) => `${i + 1}번 카드: ${c.korean} (${c.name}) — 키워드: ${c.keyword}`)
      .join('\n');

    const prompt = `사용자가 오늘의 주제 "${TOPIC_LABELS[topic] ?? topic}"에 대해 다음 3장의 타로 카드를 뽑았습니다.

${cardList}

아래 JSON 형식으로만 응답하세요 (코드블록 없이):
{
  "cards": [
    { "name": "카드 한국어 이름", "reading": "이 카드가 주제와 관련해 전하는 핵심 메시지. 1~2문장." },
    { "name": "카드 한국어 이름", "reading": "1~2문장." },
    { "name": "카드 한국어 이름", "reading": "1~2문장." }
  ],
  "overall": "세 카드가 함께 전하는 이야기. 2~3문장.",
  "advice": "타로마스터의 따뜻한 마무리 조언. 1~2문장."
}`;

    const raw = await callGemini(ai, prompt);
    const json = raw.replace(/```(?:json)?\n?/g, '').trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch (parseErr) {
      logError('JSON parse error', parseErr);
      console.error('[/api/tarot] raw response (first 500 chars):', raw.slice(0, 500));
      throw new Error('AI 응답을 파싱하는 데 실패했어요.');
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    logError('unhandled error', err);
    return NextResponse.json(
      { error: '타로마스터와 연결하는 데 문제가 생겼어요. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
