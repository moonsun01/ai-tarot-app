'use client';

import { useState, useMemo, useEffect } from 'react';

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const TOPICS = [
  {
    id: 'love',
    emoji: '💘',
    label: '연애/속마음',
    desc: '그 사람의 마음과 나의 연애운',
    color: 'from-rose-900/40 to-pink-900/30',
    glow: 'rgba(244,63,94,0.35)',
  },
  {
    id: 'career',
    emoji: '💻',
    label: '학업/진로',
    desc: '학점, 시험, 미래의 운명',
    color: 'from-indigo-900/40 to-blue-900/30',
    glow: 'rgba(99,102,241,0.35)',
  },
  {
    id: 'social',
    emoji: '🍵',
    label: '대인관계/팀플',
    desc: '빌런 퇴치, 귀인과의 만남',
    color: 'from-emerald-900/40 to-teal-900/30',
    glow: 'rgba(52,211,153,0.3)',
  },
  {
    id: 'luck',
    emoji: '🍀',
    label: '오늘의 총운',
    desc: '오늘 나에게 찾아올 행운',
    color: 'from-amber-900/40 to-yellow-900/30',
    glow: 'rgba(251,191,36,0.3)',
  },
];

const CARD_SYMBOLS = ['✦', '☽', '★', '◈', '⬡', '✧', '⊕', '⋆'];

const ARCANA = [
  { name: 'The Fool',          korean: '바보',           keyword: '새로운 시작',   meaning: '두려움 없이 새로운 여정을 시작할 준비가 되어 있습니다. 순수한 가능성이 눈앞에 펼쳐집니다.' },
  { name: 'The Magician',      korean: '마법사',         keyword: '의지와 창조',   meaning: '당신 안에 모든 도구가 갖춰져 있습니다. 집중력과 의지로 원하는 것을 현실로 만들 수 있습니다.' },
  { name: 'The High Priestess',korean: '여사제',         keyword: '직관과 신비',   meaning: '겉으로 드러나지 않은 진실이 있습니다. 내면의 목소리에 귀 기울이세요.' },
  { name: 'The Empress',       korean: '여황제',         keyword: '풍요와 창조',   meaning: '풍성함과 따뜻함이 넘칩니다. 씨앗을 뿌리면 반드시 열매를 맺을 시기입니다.' },
  { name: 'The Emperor',       korean: '황제',           keyword: '권위와 안정',   meaning: '강한 의지와 구조가 필요합니다. 체계를 세우면 원하는 목표에 도달할 수 있습니다.' },
  { name: 'The Hierophant',    korean: '교황',           keyword: '전통과 가르침', meaning: '검증된 방법과 조언을 따르는 것이 현명합니다. 멘토의 역할이 중요합니다.' },
  { name: 'The Lovers',        korean: '연인',           keyword: '사랑과 선택',   meaning: '중요한 선택의 기로에 서 있습니다. 마음이 이끄는 방향이 진정한 답입니다.' },
  { name: 'The Chariot',       korean: '전차',           keyword: '승리와 추진력', meaning: '강한 의지로 앞으로 나아가세요. 장애물을 극복하는 힘이 당신에게 있습니다.' },
  { name: 'Strength',          korean: '힘',             keyword: '용기와 인내',   meaning: '외적 힘보다 내면의 용기가 빛을 발합니다. 부드러운 인내로 어려움을 이겨냅니다.' },
  { name: 'The Hermit',        korean: '은둔자',         keyword: '내면 탐구',     meaning: '혼자만의 시간이 필요합니다. 내면을 들여다볼 때 진정한 해답을 얻을 수 있습니다.' },
  { name: 'Wheel of Fortune',  korean: '운명의 수레바퀴',keyword: '운명과 전환',   meaning: '사이클이 바뀌는 시점입니다. 변화의 흐름을 받아들이면 행운이 찾아옵니다.' },
  { name: 'Justice',           korean: '정의',           keyword: '공정과 균형',   meaning: '균형이 중요한 시기입니다. 정직하고 공정하게 행동하면 좋은 결과가 따라옵니다.' },
  { name: 'The Hanged Man',    korean: '매달린 사람',    keyword: '관점의 전환',   meaning: '기다림과 희생이 필요합니다. 다른 시각으로 보면 새로운 해결책이 보입니다.' },
  { name: 'Death',             korean: '죽음',           keyword: '변화와 재생',   meaning: '낡은 것이 끝나고 새로운 것이 시작됩니다. 두려워하지 마세요, 이것은 성장입니다.' },
  { name: 'Temperance',        korean: '절제',           keyword: '조화와 균형',   meaning: '극단을 피하고 균형을 유지하세요. 인내와 조화가 최선의 결과를 만들어냅니다.' },
  { name: 'The Devil',         korean: '악마',           keyword: '속박과 유혹',   meaning: '스스로를 가두는 생각이나 습관을 경계하세요. 자유는 당신 손에 달려 있습니다.' },
  { name: 'The Tower',         korean: '탑',             keyword: '급변과 해방',   meaning: '갑작스러운 변화가 찾아올 수 있습니다. 흔들리지 마세요, 이 과정 끝에 해방이 있습니다.' },
  { name: 'The Star',          korean: '별',             keyword: '희망과 치유',   meaning: '어둠 속에서도 별빛이 빛납니다. 희망을 잃지 마세요, 치유와 회복의 시기입니다.' },
  { name: 'The Moon',          korean: '달',             keyword: '환상과 직관',   meaning: '불확실함이 있을 수 있습니다. 직관을 믿고 감정의 흐름을 따라가세요.' },
  { name: 'The Sun',           korean: '태양',           keyword: '기쁨과 성공',   meaning: '밝고 긍정적인 에너지가 넘칩니다. 성공과 행복이 가까이에 있으니 자신감을 가지세요.' },
  { name: 'Judgement',         korean: '심판',           keyword: '각성과 부름',   meaning: '새로운 소명이 당신을 부르고 있습니다. 과거를 용서하고 더 높은 목적으로 나아가세요.' },
  { name: 'The World',         korean: '세계',           keyword: '완성과 통합',   meaning: '하나의 중요한 사이클이 완성되었습니다. 성취감과 함께 새로운 시작을 준비하세요.' },
];

/* ─────────────────────────────────────────────
   StarField
───────────────────────────────────────────── */
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.55 + 0.15,
        animDelay: `${Math.random() * 5}s`,
        animDuration: `${2 + Math.random() * 3}s`,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            opacity: s.opacity,
            animationDelay: s.animDelay,
            animationDuration: s.animDuration,
          }}
        />
      ))}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-800/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl" />
      <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-fuchsia-800/8 blur-3xl" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Grimoire Card SVG (top card face)
───────────────────────────────────────────── */
function GrimoireCard() {
  /* Shared corner ornament — rendered 4× with different transforms */
  const Corner = () => (
    <>
      <path d="M 7,30 Q 7,7 30,7" stroke="#D4AF37" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
      <path d="M 10,30 Q 10,10 30,10" stroke="rgba(139,92,246,0.38)" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
      <polygon points="7,4 11,8 7,12 3,8" fill="rgba(212,175,55,0.5)" stroke="#D4AF37" strokeWidth="0.6" opacity="0.8"/>
      {/* top edge tendrils */}
      <path d="M 32,7 C 38,4.5 42,9.5 48,7"  stroke="#C5A028" strokeWidth="0.7" fill="none" opacity="0.45"/>
      <path d="M 50,7 C 55,5 59,9 63,7"       stroke="rgba(139,92,246,0.28)" strokeWidth="0.55" fill="none"/>
      {/* left edge tendrils */}
      <path d="M 7,32 C 4.5,38 9.5,42 7,48"  stroke="#C5A028" strokeWidth="0.7" fill="none" opacity="0.45"/>
      <path d="M 7,50 C 5,55 9,59 7,63"       stroke="rgba(139,92,246,0.28)" strokeWidth="0.55" fill="none"/>
      {/* dots */}
      <circle cx="40" cy="7"  r="1.1" fill="#D4AF37" opacity="0.65"/>
      <circle cx="56" cy="7"  r="0.7" fill="rgba(167,139,250,0.5)"/>
      <circle cx="7"  cy="40" r="1.1" fill="#D4AF37" opacity="0.65"/>
      <circle cx="7"  cy="56" r="0.7" fill="rgba(167,139,250,0.5)"/>
      {/* diagonal + cross accent */}
      <line x1="10" y1="10" x2="20" y2="20" stroke="#C5A028" strokeWidth="0.6" opacity="0.28"/>
      <line x1="5"  y1="19" x2="11" y2="25" stroke="#D4AF37" strokeWidth="0.6" opacity="0.38"/>
      <line x1="5"  y1="25" x2="11" y2="19" stroke="#D4AF37" strokeWidth="0.6" opacity="0.38"/>
    </>
  );

  return (
    <svg viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg"
      width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="gc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#1c0840"/>
          <stop offset="45%"  stopColor="#240e50"/>
          <stop offset="100%" stopColor="#0e0625"/>
        </linearGradient>
        <radialGradient id="gc-ctr" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f0abfc" stopOpacity="0.55"/>
          <stop offset="40%"  stopColor="#c084fc" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="gc-star" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f9a8d4" stopOpacity="0.85"/>
          <stop offset="55%"  stopColor="#e879f9" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
        </radialGradient>
        <filter id="gc-tex">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n" result="g"/>
          <feBlend in="SourceGraphic" in2="g" mode="soft-light"/>
        </filter>
      </defs>

      {/* background + parchment texture */}
      <rect width="160" height="260" rx="10" fill="url(#gc-bg)"/>
      <rect width="160" height="260" rx="10" fill="url(#gc-bg)" filter="url(#gc-tex)" opacity="0.09"/>

      {/* triple border */}
      <rect x="1.5" y="1.5" width="157" height="257" rx="9"  fill="none" stroke="#C5A028" strokeWidth="1.4" opacity="0.7"/>
      <rect x="7"   y="7"   width="146" height="246" rx="7"  fill="none" stroke="rgba(139,92,246,0.3)"  strokeWidth="0.7"/>
      <rect x="10"  y="10"  width="140" height="240" rx="6"  fill="none" stroke="rgba(109,40,217,0.18)" strokeWidth="0.5"/>

      {/* corner ornaments (4× mirrored) */}
      <g opacity="0.9"><Corner/></g>
      <g opacity="0.9" transform="translate(160,0)   scale(-1, 1)"><Corner/></g>
      <g opacity="0.9" transform="translate(0,260)   scale( 1,-1)"><Corner/></g>
      <g opacity="0.9" transform="translate(160,260) scale(-1,-1)"><Corner/></g>

      {/* edge midpoint diamonds */}
      {([
        'translate(80,7)', 'translate(80,253)',
        'translate(7,130)', 'translate(153,130)',
      ] as const).map((t) => (
        <g key={t} transform={t}>
          <line x1="-8" y1="0" x2="8" y2="0"  stroke="#C5A028" strokeWidth="0.7" opacity="0.45"/>
          <line x1="0" y1="-8" x2="0" y2="8"  stroke="#C5A028" strokeWidth="0.7" opacity="0.45"/>
          <polygon points="0,-2.5 2.5,0 0,2.5 -2.5,0" fill="#D4AF37" opacity="0.55"/>
        </g>
      ))}

      {/* ARCANA label */}
      <text x="80" y="33" textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fill="rgba(212,175,55,0.55)"
        fontFamily="Georgia,'Times New Roman',serif" letterSpacing="4">· ARCANA ·</text>
      <path d="M 48,39 Q 80,37 112,39" stroke="rgba(212,175,55,0.18)" strokeWidth="0.6" fill="none"/>

      {/* ── MAGIC CIRCLE (centred at 80,120) ── */}
      <g transform="translate(80,120)">

        {/* outer dashed ring — CW 36s */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="360" dur="36s" repeatCount="indefinite"/>
          <circle r="50" fill="none" stroke="rgba(109,40,217,0.15)" strokeWidth="1" strokeDasharray="3 7"/>
          {/* cardinal tick marks */}
          <line x1="47"  y1="0"   x2="50"  y2="0"   stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="-50" y1="0"   x2="-47" y2="0"   stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="0"   y1="-50" x2="0"   y2="-47" stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="0"   y1="47"  x2="0"   y2="50"  stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          {/* diagonal tick marks */}
          <line x1="33"  y1="-33" x2="35"  y2="-35" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
          <line x1="-33" y1="-33" x2="-35" y2="-35" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
          <line x1="33"  y1="33"  x2="35"  y2="35"  stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
          <line x1="-33" y1="33"  x2="-35" y2="35"  stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
        </g>

        {/* octagram geometric lines (static) */}
        <g opacity="0.065" stroke="rgba(139,92,246,1)" strokeWidth="0.7">
          <line x1="-48" y1="0"   x2="48"  y2="0"/>
          <line x1="0"   y1="-48" x2="0"   y2="48"/>
          <line x1="-34" y1="-34" x2="34"  y2="34"/>
          <line x1="34"  y1="-34" x2="-34" y2="34"/>
        </g>

        {/* middle ring — CCW 24s */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="-360" dur="24s" repeatCount="indefinite"/>
          <circle r="38" fill="none" stroke="rgba(139,92,246,0.22)" strokeWidth="0.8" strokeDasharray="2 5"/>
          <polygon points=" 38,-2  40,0  38,2  36,0" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
          <polygon points="-38,-2 -40,0 -38,2 -36,0" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
          <polygon points="-2,-38  0,-40  2,-38  0,-36" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
          <polygon points="-2, 38  0, 40  2, 38  0, 36" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
        </g>

        {/* inner dotted ring — CW 16s */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="360" dur="16s" repeatCount="indefinite"/>
          <circle r="26" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="0.6" strokeDasharray="1 3.5"/>
          <circle cx="26"    cy="0"     r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="-26"   cy="0"     r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="13"    cy="-22.5" r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="-13"   cy="-22.5" r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="13"    cy="22.5"  r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="-13"   cy="22.5"  r="0.9" fill="rgba(192,132,252,0.4)"/>
        </g>

        {/* ── elemental symbols (static) ── */}
        {/* IGNIS — fire △ */}
        <g transform="translate(0,-43)">
          <path d="M 0,-6 L 5.5,4 L -5.5,4 Z"
            fill="none" stroke="rgba(251,191,36,0.75)" strokeWidth="0.9" strokeLinejoin="round"/>
          <text x="0" y="13" textAnchor="middle" fontSize="5"
            fill="rgba(251,191,36,0.42)" fontFamily="Georgia,serif" letterSpacing="0.6">IGNIS</text>
        </g>
        {/* AQUA — water ▽ */}
        <g transform="translate(0,43)">
          <path d="M 0,6 L 5.5,-4 L -5.5,-4 Z"
            fill="none" stroke="rgba(147,197,253,0.7)" strokeWidth="0.9" strokeLinejoin="round"/>
          <text x="0" y="-9" textAnchor="middle" dominantBaseline="auto" fontSize="5"
            fill="rgba(147,197,253,0.42)" fontFamily="Georgia,serif" letterSpacing="0.6">AQUA</text>
        </g>
        {/* AERO — air △ with bar */}
        <g transform="translate(43,0)">
          <path d="M 0,-6 L 5.5,4 L -5.5,4 Z"
            fill="none" stroke="rgba(192,132,252,0.7)" strokeWidth="0.9" strokeLinejoin="round"/>
          <line x1="-3.5" y1="1" x2="3.5" y2="1" stroke="rgba(192,132,252,0.7)" strokeWidth="0.9"/>
          <text x="9" y="0" dominantBaseline="middle" fontSize="5"
            fill="rgba(192,132,252,0.38)" fontFamily="Georgia,serif" letterSpacing="0.3">AERO</text>
        </g>
        {/* TERRA — earth ▽ with bar */}
        <g transform="translate(-43,0)">
          <path d="M 0,6 L 5.5,-4 L -5.5,-4 Z"
            fill="none" stroke="rgba(110,231,183,0.65)" strokeWidth="0.9" strokeLinejoin="round"/>
          <line x1="-3.5" y1="-1" x2="3.5" y2="-1" stroke="rgba(110,231,183,0.65)" strokeWidth="0.9"/>
          <text x="-9" y="0" textAnchor="end" dominantBaseline="middle" fontSize="5"
            fill="rgba(110,231,183,0.38)" fontFamily="Georgia,serif" letterSpacing="0.3">TERRA</text>
        </g>

        {/* center radial glows */}
        <circle r="22" fill="url(#gc-ctr)"/>
        <circle r="13" fill="url(#gc-star)" opacity="0.65"/>

        {/* ✦ pulsing star */}
        <text x="0" y="0" textAnchor="middle" dominantBaseline="middle"
          fontSize="26" fill="#e879f9" fontFamily="Georgia,serif"
          className="grimoire-star">✦</text>
      </g>

      {/* bottom section */}
      <path d="M 44,192 Q 80,190 116,192" stroke="rgba(212,175,55,0.2)" strokeWidth="0.7" fill="none"/>
      <text x="80" y="208" textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fill="rgba(192,132,252,0.65)"
        fontFamily="Georgia,'Times New Roman',serif" letterSpacing="7">TAROT</text>
      <line x1="34"  y1="208" x2="52"  y2="208" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8"/>
      <line x1="108" y1="208" x2="126" y2="208" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8"/>
      <circle cx="56"  cy="208" r="1.2" fill="rgba(212,175,55,0.5)"/>
      <circle cx="104" cy="208" r="1.2" fill="rgba(212,175,55,0.5)"/>

      {/* bottom ornament cluster */}
      <g transform="translate(80,228)" opacity="0.6">
        <polygon points="0,-4 4,0 0,4 -4,0" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="0.7"/>
        <line x1="-14" y1="0" x2="-7" y2="0"  stroke="rgba(212,175,55,0.35)" strokeWidth="0.7"/>
        <line x1="7"   y1="0" x2="14" y2="0"  stroke="rgba(212,175,55,0.35)" strokeWidth="0.7"/>
        <circle cx="-18" cy="0" r="0.8" fill="rgba(212,175,55,0.35)"/>
        <circle cx=" 18" cy="0" r="0.8" fill="rgba(212,175,55,0.35)"/>
      </g>
      <text x="80" y="244" textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fill="rgba(139,92,246,0.32)"
        fontFamily="Georgia,serif" letterSpacing="3">✦ ✦ ✦</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   3D Card Deck
───────────────────────────────────────────── */
function TarotDeck() {
  const layers = [
    { dx: '-10px', dy: '8px',  rot: '-6deg', opacity: 0.35, scale: 0.96 },
    { dx: '-5px',  dy: '4px',  rot: '-3deg', opacity: 0.55, scale: 0.98 },
    { dx:  '3px',  dy: '1px',  rot:  '1deg', opacity: 0.72, scale: 0.99 },
    { dx: '-2px',  dy: '-2px', rot: '-1deg', opacity: 0.88, scale: 1.0  },
    { dx:  '0px',  dy: '0px',  rot:  '0deg', opacity: 1.0,  scale: 1.0  },
  ];

  return (
    <div className="relative mx-auto float-deck" style={{ width: 160, height: 260 }}>
      {layers.map((l, i) => {
        const isTop = i === layers.length - 1;
        return (
          <div
            key={i}
            className="absolute inset-0 rounded-[10px]"
            style={{
              transform: `rotate(${l.rot}) translate(${l.dx}, ${l.dy}) scale(${l.scale})`,
              opacity: l.opacity,
              zIndex: i,
              boxShadow: isTop
                ? '0 0 28px rgba(168,85,247,0.45), 0 20px 60px rgba(0,0,0,0.65)'
                : '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            {isTop ? (
              <GrimoireCard />
            ) : (
              <div className="w-full h-full rounded-[10px]" style={{
                background: 'linear-gradient(145deg, #180630, #2a155a, #120930)',
                border: '1px solid rgba(109,40,217,0.3)',
              }}/>
            )}
          </div>
        );
      })}

      {/* ground glow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-6 rounded-full blur-xl"
        style={{ background: 'rgba(139,92,246,0.48)' }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Result Modal
───────────────────────────────────────────── */
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

function ResultModal({ topicId, cardIndices, onClose }: ModalProps) {
  const [phase, setPhase] = useState<'loading' | 'result' | 'error'>('loading');
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);
  const [showSection, setShowSection] = useState(0);

  const cards = cardIndices.map((i) => ARCANA[i]);

  /* Cycle loading messages */
  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setInterval(() => setMsgIdx((p) => (p + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, [phase]);

  /* Fetch AI reading */
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

  /* Stagger result sections */
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

  const glassBox = {
    background: 'rgba(88,28,135,0.18)',
    border: '1px solid rgba(167,139,250,0.18)',
    backdropFilter: 'blur(8px)',
  };

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
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors"
            style={{ background: 'rgba(109,40,217,0.2)', border: '1px solid rgba(167,139,250,0.2)' }}
          >✕</button>

          {/* ── Loading ── */}
          {phase === 'loading' && (
            <div className="flex flex-col items-center gap-6 py-14">
              <span className="text-6xl orb-glow">🔮</span>

              {/* Orbiting dots */}
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
                <p className="text-purple-400/50 text-xs">Gemini AI가 신탁을 준비하고 있습니다</p>
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

          {/* ── Error ── */}
          {phase === 'error' && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="text-5xl">⚠️</span>
              <p className="text-purple-200 text-sm leading-relaxed">{errorMsg}</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 rounded-full text-sm font-bold text-purple-200 glass-card">
                닫기
              </button>
            </div>
          )}

          {/* ── Result ── */}
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
                🔮 타로마스터의 신탁
              </h2>

              {/* Selected card thumbnails */}
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

              {/* Section 1: Individual card readings */}
              <div className="flex flex-col gap-2 mb-5" style={fadeSection(0)}>
                {aiResult.cards.map((c, idx) => (
                  <div key={idx} className="rounded-xl px-4 py-3 text-sm text-purple-200/85 leading-relaxed" style={glassBox}>
                    <span className="font-bold text-purple-300">{idx + 1}번 카드 · {c.name}</span>
                    <br />
                    {c.reading}
                  </div>
                ))}
              </div>

              {/* Section 2: Overall reading */}
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

              {/* Section 3: Advice + close */}
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

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleTopicClick = (topicId: string) => {
    setSelectedTopic(topicId);
    setSelectedCards([]);
    setShowModal(false);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards((prev) => prev.filter((c) => c !== index));
    } else if (selectedCards.length < 3) {
      setSelectedCards((prev) => [...prev, index]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCards([]);
    setSelectedTopic(null);
  };

  const activeTopic = TOPICS.find((t) => t.id === selectedTopic);
  const allSelected = selectedCards.length === 3;

  return (
    <div className="min-h-screen bg-[#06000f] text-white relative overflow-x-hidden">
      <StarField />

      <main className="relative z-10 flex flex-col items-center py-12 px-4">

        {/* ── Title ── */}
        <div className="text-center mb-2">
          <div className="text-6xl md:text-7xl mb-4 orb-glow">🔮</div>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #c4b5fd, #f0abfc, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 16px rgba(167,139,250,0.4))',
            }}
          >
            DC&amp;M AI 타로점
          </h1>
          <p className="text-purple-300/65 text-sm md:text-base">
            컴퓨터공학부 학술 정동아리 DC&amp;M 부스에 오신 것을 환영합니다! ✨
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 my-7 w-full max-w-sm">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-600/40" />
          <span className="text-purple-500/50 text-xs tracking-widest">✦ ✦ ✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-600/40" />
        </div>

        {/* ── Topic selection view ── */}
        {!selectedTopic ? (
          <div className="flex flex-col items-center gap-10 w-full max-w-2xl">

            {/* 3D Deck */}
            <TarotDeck />

            {/* Topic cards */}
            <div className="w-full">
              <p className="text-center text-purple-300/45 text-xs tracking-[0.25em] uppercase mb-5">
                운세 주제를 선택하세요
              </p>
              <div className="grid grid-cols-2 gap-4">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic.id)}
                    className={`glass-card group flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition-all duration-300 bg-gradient-to-br ${topic.color}`}
                  >
                    <span
                      className="text-3xl"
                      style={{ filter: `drop-shadow(0 0 8px ${topic.glow})` }}
                    >
                      {topic.emoji}
                    </span>
                    <span className="text-base font-bold text-purple-100 group-hover:text-white transition-colors">
                      {topic.label}
                    </span>
                    <span className="text-xs text-purple-300/60 leading-relaxed group-hover:text-purple-300/80 transition-colors">
                      {topic.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        ) : (
          /* ── Card selection view ── */
          <div className="flex flex-col items-center gap-6 w-full max-w-3xl fade-up">

            {/* Topic badge */}
            <div className="flex items-center gap-3">
              <span
                className="px-5 py-2 rounded-full text-lg font-bold text-purple-100 glass-card"
                style={{ animationDuration: '2s' }}
              >
                {activeTopic?.emoji} {activeTopic?.label}
              </span>
              <button
                onClick={() => { setSelectedTopic(null); setSelectedCards([]); }}
                className="text-xs text-purple-500 hover:text-purple-300 border border-purple-800/60 hover:border-purple-600/60 px-3 py-1.5 rounded-full transition-colors"
              >
                다시 선택
              </button>
            </div>

            {/* Instruction */}
            <p className="text-purple-300/60 text-sm text-center">
              {allSelected
                ? '✨ 카드 3장이 선택되었습니다! 이제 결과를 확인해보세요.'
                : `마음이 끌리는 카드를 ${3 - selectedCards.length}장 더 골라주세요`}
            </p>

            {/* Cards grid */}
            <div
              className="glass-card w-full rounded-3xl p-5"
              style={{ animationDuration: '4s' }}
            >
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-2.5">
                {Array.from({ length: 22 }, (_, i) => {
                  const isSelected = selectedCards.includes(i);
                  const isDisabled = !isSelected && allSelected;
                  const selOrder = selectedCards.indexOf(i) + 1;
                  const symbol = CARD_SYMBOLS[i % CARD_SYMBOLS.length];

                  return (
                    <div
                      key={i}
                      onClick={() => !isDisabled && handleCardClick(i)}
                      className="relative rounded-lg overflow-visible transition-all duration-300"
                      style={{
                        aspectRatio: '2 / 3',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transform: isSelected ? 'translateY(-20px) scale(1.12)' : 'translateY(0) scale(1)',
                        opacity: isDisabled ? 0.3 : 1,
                        zIndex: isSelected ? 10 : 1,
                        filter: isSelected
                          ? 'drop-shadow(0 0 12px rgba(192,132,252,0.9))'
                          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, #3b0764, #4c1d95, #2e1065)'
                            : 'linear-gradient(135deg, #1a0a2e, #2d1a5e, #120930)',
                          border: isSelected
                            ? '1px solid rgba(192,132,252,0.75)'
                            : '1px solid rgba(109,40,217,0.35)',
                        }}
                      >
                        <div
                          className="absolute inset-[3px] rounded flex items-center justify-center"
                          style={{ border: '1px solid rgba(167,139,250,0.18)' }}
                        >
                          <span
                            className="select-none text-base"
                            style={{
                              color: isSelected ? 'rgba(216,180,254,0.75)' : 'rgba(109,40,217,0.45)',
                              filter: isSelected ? 'drop-shadow(0 0 6px rgba(192,132,252,0.7))' : 'none',
                            }}
                          >
                            {symbol}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white z-20"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            boxShadow: '0 0 10px rgba(168,85,247,0.9)',
                          }}
                        >
                          {selOrder}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result button */}
            <div
              className="transition-all duration-500"
              style={{
                opacity: allSelected ? 1 : 0,
                transform: allSelected ? 'translateY(0)' : 'translateY(14px)',
                pointerEvents: allSelected ? 'auto' : 'none',
              }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #6d28d9, #7c3aed, #a21caf)',
                  boxShadow: '0 0 32px rgba(167,139,250,0.45)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(167,139,250,0.7)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(167,139,250,0.45)';
                }}
              >
                🔮 AI 타로마스터에게 결과 물어보기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && selectedTopic && selectedCards.length === 3 && (
        <ResultModal
          topicId={selectedTopic}
          cardIndices={selectedCards}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
