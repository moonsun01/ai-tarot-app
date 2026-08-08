const Corner = () => (
  <>
    <path d="M 7,30 Q 7,7 30,7" stroke="#D4AF37" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
    <path d="M 10,30 Q 10,10 30,10" stroke="rgba(139,92,246,0.38)" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
    <polygon points="7,4 11,8 7,12 3,8" fill="rgba(212,175,55,0.5)" stroke="#D4AF37" strokeWidth="0.6" opacity="0.8"/>
    <path d="M 32,7 C 38,4.5 42,9.5 48,7"  stroke="#C5A028" strokeWidth="0.7" fill="none" opacity="0.45"/>
    <path d="M 50,7 C 55,5 59,9 63,7"       stroke="rgba(139,92,246,0.28)" strokeWidth="0.55" fill="none"/>
    <path d="M 7,32 C 4.5,38 9.5,42 7,48"  stroke="#C5A028" strokeWidth="0.7" fill="none" opacity="0.45"/>
    <path d="M 7,50 C 5,55 9,59 7,63"       stroke="rgba(139,92,246,0.28)" strokeWidth="0.55" fill="none"/>
    <circle cx="40" cy="7"  r="1.1" fill="#D4AF37" opacity="0.65"/>
    <circle cx="56" cy="7"  r="0.7" fill="rgba(167,139,250,0.5)"/>
    <circle cx="7"  cy="40" r="1.1" fill="#D4AF37" opacity="0.65"/>
    <circle cx="7"  cy="56" r="0.7" fill="rgba(167,139,250,0.5)"/>
    <line x1="10" y1="10" x2="20" y2="20" stroke="#C5A028" strokeWidth="0.6" opacity="0.28"/>
    <line x1="5"  y1="19" x2="11" y2="25" stroke="#D4AF37" strokeWidth="0.6" opacity="0.38"/>
    <line x1="5"  y1="25" x2="11" y2="19" stroke="#D4AF37" strokeWidth="0.6" opacity="0.38"/>
  </>
);

export default function GrimoireCard() {
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

      <rect width="160" height="260" rx="10" fill="url(#gc-bg)"/>
      <rect width="160" height="260" rx="10" fill="url(#gc-bg)" filter="url(#gc-tex)" opacity="0.09"/>

      <rect x="1.5" y="1.5" width="157" height="257" rx="9"  fill="none" stroke="#C5A028" strokeWidth="1.4" opacity="0.7"/>
      <rect x="7"   y="7"   width="146" height="246" rx="7"  fill="none" stroke="rgba(139,92,246,0.3)"  strokeWidth="0.7"/>
      <rect x="10"  y="10"  width="140" height="240" rx="6"  fill="none" stroke="rgba(109,40,217,0.18)" strokeWidth="0.5"/>

      <g opacity="0.9"><Corner/></g>
      <g opacity="0.9" transform="translate(160,0)   scale(-1, 1)"><Corner/></g>
      <g opacity="0.9" transform="translate(0,260)   scale( 1,-1)"><Corner/></g>
      <g opacity="0.9" transform="translate(160,260) scale(-1,-1)"><Corner/></g>

      {(['translate(80,7)', 'translate(80,253)', 'translate(7,130)', 'translate(153,130)'] as const).map((t) => (
        <g key={t} transform={t}>
          <line x1="-8" y1="0" x2="8" y2="0"  stroke="#C5A028" strokeWidth="0.7" opacity="0.45"/>
          <line x1="0" y1="-8" x2="0" y2="8"  stroke="#C5A028" strokeWidth="0.7" opacity="0.45"/>
          <polygon points="0,-2.5 2.5,0 0,2.5 -2.5,0" fill="#D4AF37" opacity="0.55"/>
        </g>
      ))}

      <text x="80" y="33" textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fill="rgba(212,175,55,0.55)"
        fontFamily="Georgia,'Times New Roman',serif" letterSpacing="4">· ARCANA ·</text>
      <path d="M 48,39 Q 80,37 112,39" stroke="rgba(212,175,55,0.18)" strokeWidth="0.6" fill="none"/>

      <g transform="translate(80,120)">
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="360" dur="36s" repeatCount="indefinite"/>
          <circle r="50" fill="none" stroke="rgba(109,40,217,0.15)" strokeWidth="1" strokeDasharray="3 7"/>
          <line x1="47"  y1="0"   x2="50"  y2="0"   stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="-50" y1="0"   x2="-47" y2="0"   stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="0"   y1="-50" x2="0"   y2="-47" stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="0"   y1="47"  x2="0"   y2="50"  stroke="rgba(167,139,250,0.32)" strokeWidth="1"/>
          <line x1="33"  y1="-33" x2="35"  y2="-35" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
          <line x1="-33" y1="-33" x2="-35" y2="-35" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
          <line x1="33"  y1="33"  x2="35"  y2="35"  stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
          <line x1="-33" y1="33"  x2="-35" y2="35"  stroke="rgba(167,139,250,0.2)" strokeWidth="0.8"/>
        </g>

        <g opacity="0.065" stroke="rgba(139,92,246,1)" strokeWidth="0.7">
          <line x1="-48" y1="0"   x2="48"  y2="0"/>
          <line x1="0"   y1="-48" x2="0"   y2="48"/>
          <line x1="-34" y1="-34" x2="34"  y2="34"/>
          <line x1="34"  y1="-34" x2="-34" y2="34"/>
        </g>

        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="-360" dur="24s" repeatCount="indefinite"/>
          <circle r="38" fill="none" stroke="rgba(139,92,246,0.22)" strokeWidth="0.8" strokeDasharray="2 5"/>
          <polygon points=" 38,-2  40,0  38,2  36,0" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
          <polygon points="-38,-2 -40,0 -38,2 -36,0" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
          <polygon points="-2,-38  0,-40  2,-38  0,-36" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
          <polygon points="-2, 38  0, 40  2, 38  0, 36" fill="rgba(167,139,250,0.5)" stroke="rgba(192,132,252,0.7)" strokeWidth="0.3"/>
        </g>

        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="360" dur="16s" repeatCount="indefinite"/>
          <circle r="26" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="0.6" strokeDasharray="1 3.5"/>
          <circle cx="26"  cy="0"     r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="-26" cy="0"     r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="13"  cy="-22.5" r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="-13" cy="-22.5" r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="13"  cy="22.5"  r="0.9" fill="rgba(192,132,252,0.4)"/>
          <circle cx="-13" cy="22.5"  r="0.9" fill="rgba(192,132,252,0.4)"/>
        </g>

        <g transform="translate(0,-43)">
          <path d="M 0,-6 L 5.5,4 L -5.5,4 Z"
            fill="none" stroke="rgba(251,191,36,0.75)" strokeWidth="0.9" strokeLinejoin="round"/>
          <text x="0" y="13" textAnchor="middle" fontSize="5"
            fill="rgba(251,191,36,0.42)" fontFamily="Georgia,serif" letterSpacing="0.6">IGNIS</text>
        </g>
        <g transform="translate(0,43)">
          <path d="M 0,6 L 5.5,-4 L -5.5,-4 Z"
            fill="none" stroke="rgba(147,197,253,0.7)" strokeWidth="0.9" strokeLinejoin="round"/>
          <text x="0" y="-9" textAnchor="middle" dominantBaseline="auto" fontSize="5"
            fill="rgba(147,197,253,0.42)" fontFamily="Georgia,serif" letterSpacing="0.6">AQUA</text>
        </g>
        <g transform="translate(43,0)">
          <path d="M 0,-6 L 5.5,4 L -5.5,4 Z"
            fill="none" stroke="rgba(192,132,252,0.7)" strokeWidth="0.9" strokeLinejoin="round"/>
          <line x1="-3.5" y1="1" x2="3.5" y2="1" stroke="rgba(192,132,252,0.7)" strokeWidth="0.9"/>
          <text x="9" y="0" dominantBaseline="middle" fontSize="5"
            fill="rgba(192,132,252,0.38)" fontFamily="Georgia,serif" letterSpacing="0.3">AERO</text>
        </g>
        <g transform="translate(-43,0)">
          <path d="M 0,6 L 5.5,-4 L -5.5,-4 Z"
            fill="none" stroke="rgba(110,231,183,0.65)" strokeWidth="0.9" strokeLinejoin="round"/>
          <line x1="-3.5" y1="-1" x2="3.5" y2="-1" stroke="rgba(110,231,183,0.65)" strokeWidth="0.9"/>
          <text x="-9" y="0" textAnchor="end" dominantBaseline="middle" fontSize="5"
            fill="rgba(110,231,183,0.38)" fontFamily="Georgia,serif" letterSpacing="0.3">TERRA</text>
        </g>

        <circle r="22" fill="url(#gc-ctr)"/>
        <circle r="13" fill="url(#gc-star)" opacity="0.65"/>

        <text x="0" y="0" textAnchor="middle" dominantBaseline="middle"
          fontSize="26" fill="#e879f9" fontFamily="Georgia,serif"
          className="grimoire-star">✦</text>
      </g>

      <path d="M 44,192 Q 80,190 116,192" stroke="rgba(212,175,55,0.2)" strokeWidth="0.7" fill="none"/>
      <text x="80" y="208" textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fill="rgba(192,132,252,0.65)"
        fontFamily="Georgia,'Times New Roman',serif" letterSpacing="7">TAROT</text>
      <line x1="34"  y1="208" x2="52"  y2="208" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8"/>
      <line x1="108" y1="208" x2="126" y2="208" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8"/>
      <circle cx="56"  cy="208" r="1.2" fill="rgba(212,175,55,0.5)"/>
      <circle cx="104" cy="208" r="1.2" fill="rgba(212,175,55,0.5)"/>

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
