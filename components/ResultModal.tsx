'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useOffline } from 'next/offline';
import { ARCANA, CARD_SYMBOLS } from '@/data/arcana';

interface ModalProps {
  topicId: string;
  /** 세부 선택이 있는 주제에서 사용자가 고른 세부 항목 id (없으면 null) */
  subTopic?: string | null;
  cardIndices: number[];
  onClose: () => void;
}

interface AiResult {
  cards: { name: string; reading: string }[];
  overall: string;
  advice: string;
}

// 뽑은 3장에 고정된 역할을 부여해 AI가 카드별로 다른 관점에서 해석하도록 한다.
// (이 역할도 프롬프트에 그대로 전달된다 — app/api/tarot/route.ts 와 의미가 일치해야 한다.)
const CARD_ROLES = ['현재 상황과 핵심 흐름', '전개되는 변화와 그 방향', '조언과 앞으로의 흐름'];
// 상단 미니 카드에서 자리를 짧게 가리키는 태그 — CARD_ROLES 와 순서가 일치한다.
const CARD_ROLE_TAGS = ['현재', '변화', '조언'];

const LOADING_MESSAGES = [
  '별자리가 배열되는 중...',
  '우주의 에너지를 모으는 중...',
  '신비로운 운세를 분석하는 중...',
  '타로마스터가 카드를 읽는 중...',
];

const OFFLINE_MESSAGE =
  '현재 인터넷에 연결되어 있지 않아 AI 해석을 불러올 수 없습니다. 인터넷 연결 후 다시 시도해 주세요.';

// fetch() rejects with a generic TypeError when the request never reaches a
// server at all (offline, DNS failure, captive portal, dropped connection),
// as opposed to the Error we throw ourselves for a server-provided message.
function isNetworkError(err: unknown) {
  return err instanceof TypeError || !navigator.onLine;
}

const glassBox = {
  background: 'rgba(88,28,135,0.18)',
  border: '1px solid rgba(167,139,250,0.18)',
  backdropFilter: 'blur(8px)',
};

export default function ResultModal({ topicId, subTopic, cardIndices, onClose }: ModalProps) {
  const [phase, setPhase] = useState<'loading' | 'result' | 'error'>('loading');
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);
  const [showSection, setShowSection] = useState(0);
  const wasNetworkErrorRef = useRef(false);
  const isOffline = useOffline();

  const cards = cardIndices.map((i) => ARCANA[i]);

  // 카드를 뒤집는 순간 각 카드의 정방향/역방향이 결정된다. 한 번 정해지면
  // 이 리딩이 끝날 때까지(다시 시도해도) 고정된다.
  const [reversed] = useState<boolean[]>(() => cardIndices.map(() => Math.random() < 0.5));

  // AI에게 넘길 카드 데이터 — 이름/키워드뿐 아니라 앱에 정의된 정·역방향 의미까지
  // 함께 실어 보내, AI가 자체 기억이 아닌 이 데이터를 근거로 해석하도록 한다.
  const cardPayload = cards.map((card, idx) => ({
    name: card.name,
    korean: card.korean,
    reversed: reversed[idx],
    role: CARD_ROLES[idx],
    keyword: reversed[idx] ? card.reversedKeyword : card.keyword,
    meaning: reversed[idx] ? card.reversedMeaning : card.meaning,
  }));

  const fetchInterpretation = useCallback(() => {
    // Skip the request entirely when we already know we're offline — no
    // point letting the user wait on a call that can't reach the network.
    if (isOffline || !navigator.onLine) {
      wasNetworkErrorRef.current = true;
      setErrorMsg(OFFLINE_MESSAGE);
      setPhase('error');
      return;
    }

    setPhase('loading');
    setMsgIdx(0);

    fetch('/api/tarot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topicId, subTopic, cards: cardPayload }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? '오류가 발생했어요.');
        return data as AiResult;
      })
      .then((data) => {
        wasNetworkErrorRef.current = false;
        setAiResult(data);
        setPhase('result');
      })
      .catch((e: Error) => {
        const networkError = isNetworkError(e);
        wasNetworkErrorRef.current = networkError;
        setErrorMsg(networkError ? OFFLINE_MESSAGE : e.message);
        setPhase('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setInterval(() => setMsgIdx((p) => (p + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    // Deferred to a microtask so the (possible) synchronous offline branch
    // of fetchInterpretation doesn't set state directly within the effect
    // body — mirrors how the network branch already resolves via .then().
    queueMicrotask(() => fetchInterpretation());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Connection came back mid-session — retry automatically, no page
    // reload needed, but only if the last failure was network-caused (an
    // actual AI/API error shouldn't silently re-fire just because the
    // network flapped).
    const handleOnline = () => {
      if (phase === 'error' && wasNetworkErrorRef.current) {
        fetchInterpretation();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [phase, fetchInterpretation]);

  useEffect(() => {
    if (phase !== 'result') return;
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      setShowSection(n);
      if (n >= 3) clearInterval(t);
    }, 650);
    return () => clearInterval(t);
  }, [phase]);

  const fadeSection = (idx: number) => ({
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    opacity: showSection > idx ? 1 : 0,
    transform: showSection > idx ? 'translateY(0)' : 'translateY(12px)',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,0,15,0.9)', backdropFilter: 'blur(14px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-[1.5px] fade-up"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(236,72,153,0.35), rgba(79,70,229,0.7))',
        }}
      >
        <div
          className="rounded-[22px] px-6 py-8"
          style={{ background: 'linear-gradient(160deg, #0f0020, #130a2e, #0a0018)', backdropFilter: 'blur(20px)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors"
            style={{ background: 'rgba(109,40,217,0.2)', border: '1px solid rgba(167,139,250,0.2)' }}
          >✕</button>

          {phase === 'loading' && (
            <div className="flex flex-col items-center gap-6 py-14">
              <span className="text-6xl orb-glow">🔮</span>
              <div className="relative w-16 h-16">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: `hsl(${270 + i * 15}, 80%, 70%)`,
                      top: '50%', left: '50%',
                      transformOrigin: '0 0',
                      transform: `rotate(${i * 60}deg) translateX(28px) translateY(-4px)`,
                      animation: `spin-cw ${1.4 + i * 0.05}s linear infinite`,
                      opacity: 0.7 + i * 0.05,
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <p
                  className="text-base font-semibold mb-1 transition-all duration-700"
                  style={{
                    background: 'linear-gradient(135deg, #c4b5fd, #f0abfc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {LOADING_MESSAGES[msgIdx]}
                </p>
                <p className="text-purple-400/50 text-xs">Gemini AI가 타로 해석을 준비하고 있습니다</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="text-5xl">⚠️</span>
              <p className="text-purple-200 text-sm leading-relaxed">{errorMsg}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={fetchInterpretation} className="px-6 py-2 rounded-full text-sm font-bold text-purple-200 glass-card">
                  다시 시도
                </button>
                <button onClick={onClose} className="px-6 py-2 rounded-full text-sm font-bold text-purple-200 glass-card">
                  닫기
                </button>
              </div>
            </div>
          )}

          {phase === 'result' && aiResult && (
            <>
              <h2
                className="text-2xl font-extrabold text-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd, #f0abfc, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🔮 타로마스터의 메시지
              </h2>

              <div className="flex gap-3 mb-6 justify-center">
                {cards.map((card, idx) => {
                  const isRev = reversed[idx];
                  return (
                    <div key={idx} className="flex-1 max-w-[100px] flex flex-col items-center">
                      <div
                        className="w-full rounded-xl flex flex-col items-center justify-center py-3 px-2 mb-1.5 relative"
                        style={{
                          aspectRatio: '2/3',
                          background: 'linear-gradient(135deg, #3b0764, #4c1d95, #2e1065)',
                          border: '1px solid rgba(192,132,252,0.55)',
                          boxShadow: '0 0 16px rgba(168,85,247,0.4)',
                        }}
                      >
                        <span
                          className="absolute top-1 right-1.5 text-[8px] font-bold px-1 py-0.5 rounded"
                          style={{
                            color: isRev ? 'rgba(253,186,116,0.95)' : 'rgba(196,181,253,0.9)',
                            background: isRev ? 'rgba(120,53,15,0.5)' : 'rgba(76,29,149,0.5)',
                          }}
                        >
                          {isRev ? '역방향' : '정방향'}
                        </span>
                        <span
                          className="text-xl mb-1"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(192,132,252,0.8))',
                            transform: isRev ? 'rotate(180deg)' : 'none',
                          }}
                        >
                          {CARD_SYMBOLS[cardIndices[idx] % CARD_SYMBOLS.length]}
                        </span>
                        <span className="text-purple-300/50 text-[9px] text-center leading-tight">{card.name}</span>
                      </div>
                      <p className="text-center text-purple-200 text-[11px] font-bold">{card.korean}</p>
                      <span
                        className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                        style={{
                          color: 'rgba(196,181,253,0.9)',
                          background: 'rgba(76,29,149,0.4)',
                          border: '1px solid rgba(167,139,250,0.25)',
                        }}
                      >
                        {CARD_ROLE_TAGS[idx]}
                      </span>
                      <p className="text-center text-purple-400/60 text-[10px] mt-1">
                        {isRev ? card.reversedKeyword : card.keyword}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 mb-5" style={fadeSection(0)}>
                {aiResult.cards.map((c, idx) => (
                  <div key={idx} className="rounded-xl px-4 py-3 text-sm text-purple-200/85 leading-relaxed" style={glassBox}>
                    <span className="block text-[11px] font-bold tracking-wide text-purple-400/70 mb-0.5">
                      [{idx + 1}번 카드 · {CARD_ROLES[idx]}]
                    </span>
                    <span className="font-bold text-purple-300">
                      {c.name}
                      <span className={reversed[idx] ? 'text-amber-400/80' : 'text-purple-400/70'}>
                        {' '}({reversed[idx] ? '역방향' : '정방향'})
                      </span>
                    </span>
                    <br />
                    {c.reading}
                  </div>
                ))}
              </div>

              <div style={fadeSection(1)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.3))' }} />
                  <span className="text-purple-500/60 text-xs whitespace-nowrap">✦ 종합 해석 ✦</span>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(167,139,250,0.3))' }} />
                </div>
                <div className="rounded-xl px-4 py-3 mb-4 text-sm text-purple-100/90 leading-7" style={glassBox}>
                  {aiResult.overall}
                </div>
              </div>

              <div style={fadeSection(2)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.25))' }} />
                  <span className="text-amber-500/60 text-xs whitespace-nowrap">✦ 타로마스터의 조언 ✦</span>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.25))' }} />
                </div>
                <div
                  className="rounded-xl px-4 py-3 mb-6 text-sm leading-7"
                  style={{
                    ...glassBox,
                    color: 'rgba(253,230,138,0.9)',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  {aiResult.advice}
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-purple-200 transition-all duration-300 hover:scale-[1.02] glass-card"
                >
                  카드 다시 뽑기 ✨
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
