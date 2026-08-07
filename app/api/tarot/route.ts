import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const TOPIC_LABELS: Record<string, string> = {
  love:   '연애/속마음',
  career: '학업/진로',
  social: '대인관계/팀플',
  luck:   '오늘의 총운',
};

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

각 카드가 이 주제에서 전하는 메시지, 세 카드를 아우르는 종합 해석, 그리고 따뜻한 마무리 조언을 작성해 주세요.
아래 JSON 형식으로만 응답하세요 (코드블록 없이):
{
  "cards": [
    { "name": "카드 한국어 이름", "reading": "이 카드가 주제와 관련해 전하는 신비롭고 감성적인 메시지. 2~3문장." },
    { "name": "카드 한국어 이름", "reading": "..." },
    { "name": "카드 한국어 이름", "reading": "..." }
  ],
  "overall": "세 카드가 함께 전하는 이야기. 흐름이 이어지도록 3~4문장.",
  "advice": "타로마스터로서 전하는 따뜻하고 희망적인 마무리. 2~3문장."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        systemInstruction:
          '당신은 신비롭고 다정한 AI 타로마스터입니다. 사용자가 고른 주제와 선택한 타로 카드 3장의 명칭을 바탕으로 각 카드의 의미와 종합적인 해석, 그리고 따뜻한 조언을 감성적인 한국어로 작성해 주세요.',
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text ?? '';
    const json = raw.replace(/```(?:json)?\n?/g, '').trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch (parseErr) {
      console.error('[/api/tarot] JSON parse error:', parseErr);
      console.error('[/api/tarot] Raw response:', raw.slice(0, 500));
      throw new Error('AI 응답을 파싱하는 데 실패했어요.');
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; stack?: string };
    console.error('[/api/tarot] status:', e.status ?? 'N/A');
    console.error('[/api/tarot] message:', e.message ?? String(err));
    console.error('[/api/tarot] stack:', e.stack?.split('\n').slice(0, 4).join('\n'));
    return NextResponse.json(
      { error: '타로마스터와 연결하는 데 문제가 생겼어요. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
