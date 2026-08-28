import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const TOPIC_LABELS: Record<string, string> = {
  love:   '연애/속마음',
  career: '학업/진로',
  social: '대인관계/팀플',
  luck:   '오늘의 총운',
};

// 주제별로 AI에게 추가로 전달할 해석 유의사항.
// (세부 선택이 있는 주제는 세부 선택이 함께 오지 않는 예외 상황용 폴백으로만 쓰인다.)
const TOPIC_GUIDANCE: Record<string, string> = {
  // 연애/속마음 주제는 세부 선택(솔로/짝사랑/썸/커플)이 함께 오지 않는 예외 상황에 대비한
  // 폴백으로, 특정 연애 상태를 전제하지 않는 범용 안내를 사용한다.
  love: '사용자가 현재 연애 중인지, 솔로인지, 짝사랑 중인지, 새로운 인연을 기다리고 있는지는 알 수 없습니다. "상대방과의 관계", "두 사람 사이", "현재 연인"처럼 이미 연인이 있다고 단정하는 표현은 쓰지 마세요. 관계나 상대방에 대한 해석이 필요할 때는 "현재 마음에 두고 있는 사람이 있다면", "이미 관계를 이어가고 있다면", "새로운 인연을 기다리고 있다면"처럼 조건부 표현을 자연스럽게 섞어서, 솔로·짝사랑·연애 중·새로운 인연을 기다리는 사람 모두가 위화감 없이 읽을 수 있는 하나의 해석으로 작성하세요. 상황별로 문단을 나눌 필요는 없습니다.',
  luck: '오늘의 총운입니다. 오늘 하루의 전체적인 흐름, 오늘 특별히 주의할 점, 오늘의 행운 포인트(도움이 되는 행동·시간대·태도 등), 마지막으로 간단한 조언이 자연스럽게 담기도록 해석하세요.',
};

// 세부 선택(연애 상황·학업/진로 고민·관계 종류)에 대한 한국어 라벨과, AI가 어떤 관점에서
// 해석해야 하는지에 대한 구체적 지시. data/subtopics.ts 의 옵션 id 와 매칭된다.
const SUBTOPIC_LABELS: Record<string, string> = {
  single: '솔로',
  crush: '짝사랑',
  some: '썸',
  couple: '커플',
  study: '학업',
  exam: '시험',
  job: '진로/취업',
  friend: '대인관계',
  teamwork: '팀플/협업',
};

const SUBTOPIC_GUIDANCE: Record<string, string> = {
  // 연애/속마음
  single:
    '사용자는 현재 연인이 없는 솔로입니다. 이미 사귀는 사람이 있거나 특정 상대가 있다는 전제로 해석하지 마세요. 새로운 인연이 다가올 가능성, 현재 연애운, 새로운 만남의 흐름, 연애를 시작하기 위한 조언을 중심으로 해석하세요.',
  crush:
    '사용자는 현재 짝사랑 중이며, 특정 상대를 혼자 좋아하고 있는 상황입니다. 두 사람의 현재 관계 흐름, 상대방과 가까워질 가능성, 관계가 발전할 가능성, 다가갈 때의 조언을 중심으로 해석하세요. 상대방의 실제 감정을 확정적으로 단정하지 말고, 타로 카드가 보여주는 가능성과 흐름으로 표현하세요.',
  some:
    '사용자는 현재 상대와 썸을 타는 중입니다. 두 사람은 어느 정도 호감이 있고 연락이나 만남이 이어지고 있지만 아직 정식 연애는 아닙니다. 현재 두 사람의 관계 흐름, 서로의 감정 변화, 연애로 발전할 가능성, 관계 발전을 위한 조언을 중심으로 해석하세요.',
  couple:
    '사용자는 현재 연애 중인 커플입니다. 현재 관계 상태, 두 사람 사이의 감정 흐름, 갈등이나 소통에서 주의할 점, 앞으로의 관계 흐름, 관계를 위한 조언을 중심으로 해석하세요.',
  // 학업/진로
  study:
    '사용자의 고민은 학업(공부)입니다. 현재 학업 흐름, 집중력이나 공부 방향, 앞으로의 학업 흐름, 그리고 조언을 중심으로 해석하세요.',
  exam:
    '사용자의 고민은 시험입니다. 현재 준비 상태의 흐름, 시험에서 주의할 점, 좋은 결과를 위해 필요한 부분, 그리고 조언을 중심으로 해석하세요. 시험 결과를 확정적으로 예언하지 말고 가능성과 준비 방향 중심으로 표현하세요.',
  job:
    '사용자의 고민은 진로/취업입니다. 현재 진로 흐름, 적합한 방향, 기회가 들어오는 흐름, 앞으로 준비할 점, 그리고 조언을 중심으로 해석하세요.',
  // 대인관계/팀플
  friend:
    '사용자의 고민은 대인관계입니다. 친구나 주변 사람들과의 관계 흐름, 거리감이나 관계 변화, 소통에서 주의할 점, 관계를 위한 조언을 중심으로 해석하세요.',
  teamwork:
    '사용자의 고민은 팀플/협업입니다. 현재 협업 분위기, 역할 분담이나 소통 흐름, 갈등 가능성, 원활한 협업을 위한 조언을 중심으로 해석하세요.',
};

// 뽑은 3장에 부여되는 역할 — components/ResultModal.tsx 의 CARD_ROLES 와 의미가 일치해야 한다.
// (클라이언트가 role 을 함께 보내오지만, 누락 시 이 값을 폴백으로 사용한다.)
const CARD_ROLES = ['현재 상황과 핵심 흐름', '전개되는 변화와 그 방향', '조언과 앞으로의 흐름'];

const SYSTEM_INSTRUCTION = [
  '당신은 신비롭고 다정한 AI 타로마스터입니다.',
  '반드시 사용자가 실제로 뽑은 타로 카드 3장의 "이름 / 정·역방향 / 제공된 핵심 의미"만을 근거로 해석하세요.',
  '카드가 담고 있지 않은 내용을 지어내지 말고, 일반적인 운세 문구나 고정된 템플릿을 반복하지 마세요.',
  '역방향 카드는 제공된 역방향 의미대로 해석하고, 정방향과 동일하게 해석하지 마세요.',
  '상대방의 실제 감정, 미래의 사건, 합격 여부 같은 것을 사실처럼 단정하지 말고 "가능성", "흐름", "경향" 중심으로 표현하세요.',
  '카드 3장을 각각 반영하고, 그다음 세 장의 관계를 종합해 전체 흐름을 설명하세요. 한 장만으로 전체 결론을 내리지 마세요.',
  '감성적이고 따뜻한 한국어로 작성하세요.',
].join(' ');

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
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              maxOutputTokens: 1100,
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
    const { topic, cards, subTopic } = (await req.json()) as {
      topic: string;
      // 클라이언트(components/ResultModal.tsx)가 앱에 정의된 카드 데이터를 그대로 실어 보낸다.
      // keyword/meaning 은 각 카드의 "현재 방향(정/역)에 해당하는" 값이 이미 선택되어 들어온다.
      cards: {
        name: string;
        korean: string;
        reversed?: boolean;
        role?: string;
        keyword: string;
        meaning: string;
      }[];
      subTopic?: string | null;
    };

    if (!Array.isArray(cards) || cards.length !== 3) {
      throw new Error('카드 정보가 올바르게 전달되지 않았어요.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // AI가 자체 기억이 아닌 "앱에 정의된 카드 데이터"를 근거로 해석하도록,
    // 이름·방향·역할·키워드·핵심 의미를 카드별로 모두 프롬프트에 명시한다.
    const cardBlock = cards
      .map((c, i) => {
        const orientation = c.reversed ? '역방향' : '정방향';
        const role = c.role ?? CARD_ROLES[i] ?? '';
        return [
          `▸ ${i + 1}번 카드 (${role})`,
          `   - 카드: ${c.korean} (${c.name})`,
          `   - 방향: ${orientation}`,
          `   - ${orientation} 키워드: ${c.keyword}`,
          `   - ${orientation} 핵심 의미: ${c.meaning}`,
        ].join('\n');
      })
      .join('\n\n');

    const subGuidance = subTopic ? SUBTOPIC_GUIDANCE[subTopic] : undefined;
    const subLabel = subTopic ? (SUBTOPIC_LABELS[subTopic] ?? subTopic) : '없음(세부 주제 선택 없음)';
    const guidance = subGuidance
      ? `${subGuidance}`
      : TOPIC_GUIDANCE[topic]
        ? `${TOPIC_GUIDANCE[topic]}`
        : '주제에 맞게 자연스럽게 해석하세요.';

    const mainLabel = TOPIC_LABELS[topic] ?? topic;

    const prompt = `[사용자가 선택한 것]
- 대주제: ${mainLabel}
- 세부 주제: ${subLabel}

[해석 시 반드시 지킬 관점]
${guidance}

[사용자가 실제로 뽑은 타로 카드 3장 — 이 데이터만 근거로 해석하세요]
${cardBlock}

[작성 규칙]
1. 각 카드 해석(cards[].reading)은 위에 제공된 "그 카드의 방향과 핵심 의미"에서 출발해야 하며, 카드가 담지 않은 내용을 지어내지 마세요.
2. 3장을 각각 다르게 해석하세요. 카드마다 의미가 다르므로 reading 3개의 핵심 내용도 서로 뚜렷하게 달라야 합니다.
3. 역방향 카드는 위에 적힌 역방향 의미대로 해석하고, 정방향처럼 풀지 마세요.
4. overall 은 "1번 → 2번 → 3번 카드가 어떻게 이어지는지" 세 장의 관계를 종합해 하나의 흐름으로 설명하세요. 한 장만으로 결론 내리지 마세요.
5. 제공되지 않은 카드나 다른 주제(예: 세부 주제가 학업인데 연애 이야기)를 언급하지 마세요.
6. 상대방의 감정·미래 사건·합격 여부 등을 사실로 단정하지 말고 "가능성", "흐름", "경향"으로 표현하세요.
7. 일반적인 운세 문구나 매번 똑같은 템플릿 문장을 쓰지 마세요.

아래 JSON 형식으로만 응답하세요 (코드블록 없이):
{
  "cards": [
    { "name": "${cards[0].korean}", "reading": "1번 카드(${cards[0].reversed ? '역방향' : '정방향'})의 의미를 세부 주제에 맞게 푼 핵심 메시지. 2~3문장." },
    { "name": "${cards[1].korean}", "reading": "2번 카드(${cards[1].reversed ? '역방향' : '정방향'}) 해석. 2~3문장." },
    { "name": "${cards[2].korean}", "reading": "3번 카드(${cards[2].reversed ? '역방향' : '정방향'}) 해석. 2~3문장." }
  ],
  "overall": "세 카드가 이어지며 만드는 전체 흐름. 3~4문장.",
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
