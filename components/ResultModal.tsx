'use client';

import { useState, useEffect } from 'react';
import { ARCANA, CARD_SYMBOLS } from '@/data/arcana';

interface ModalProps {
  topicId: string;
  cardIndices: number[];
  onClose: () => void;
}

interface AiResult {
  cards: { name: string; reading: string }[];
  overall: string;
  advice: string;
}

const LOADING_MESSAGES = [
  '별자리가 배열되는 중...',
  '우주의 에너지를 모으는 중...',
  '신비로운 운세를 분석하는 중...',
  '타로마스터가 카드를 읽는 중...',
];

const glassBox = {
  background: 'rgba(88,28,135,0.18)',
  border: '1px solid rgba(167,139,250,0.18)',
  backdropFilter: 'blur(8px)',
};

export default function ResultModal({ topicId, cardIndices, onClose }: ModalProps) {
  const [phase, setPhase] = useState<'loading' | 'result' | 'error'>('loading');
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);
  const [showSection, setShowSection] = useState(0);

  const cards = cardIndices.map((i) => ARCANA[i]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setInterval(() => setMsgIdx((p) => (p + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    fetch('/api/tarot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topicId, cards }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? '오류가 발생했어요.');
        return data as AiResult;
      })
      .then((data) => {
        setAiResult(data);
        setPhase('result');
      })
      .catch((e: Error) => {
        setErrorMsg(e.message);
        setPhase('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <button onClick={onClose} className="mt-4 px-6 py-2 rounded-full text-sm font-bold text-purple-200 glass-card">
                닫기
              </button>
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
                {cards.map((card, idx) => (
                  <div key={idx} className="flex-1 max-w-[100px] flex flex-col items-center">
                    <div
                      className="w-full rounded-xl flex flex-col items-center justify-center py-3 px-2 mb-1.5"
                      style={{
                        aspectRatio: '2/3',
                        background: 'linear-gradient(135deg, #3b0764, #4c1d95, #2e1065)',
                        border: '1px solid rgba(192,132,252,0.55)',
                        boxShadow: '0 0 16px rgba(168,85,247,0.4)',
                      }}
                    >
                      <span className="text-xl mb-1" style={{ filter: 'drop-shadow(0 0 8px rgba(192,132,252,0.8))' }}>
                        {CARD_SYMBOLS[cardIndices[idx] % CARD_SYMBOLS.length]}
                      </span>
                      <span className="text-purple-300/50 text-[9px] text-center leading-tight">{card.name}</span>
                    </div>
                    <p className="text-center text-purple-200 text-[11px] font-bold">{card.korean}</p>
                    <p className="text-center text-purple-400/60 text-[10px] mt-0.5">{card.keyword}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mb-5" style={fadeSection(0)}>
                {aiResult.cards.map((c, idx) => (
                  <div key={idx} className="rounded-xl px-4 py-3 text-sm text-purple-200/85 leading-relaxed" style={glassBox}>
                    <span className="font-bold text-purple-300">{idx + 1}번 카드 · {c.name}</span>
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
