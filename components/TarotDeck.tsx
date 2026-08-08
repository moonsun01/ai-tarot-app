import GrimoireCard from './GrimoireCard';

const LAYERS = [
  { dx: '-10px', dy: '8px',  rot: '-6deg', opacity: 0.35, scale: 0.96 },
  { dx: '-5px',  dy: '4px',  rot: '-3deg', opacity: 0.55, scale: 0.98 },
  { dx:  '3px',  dy: '1px',  rot:  '1deg', opacity: 0.72, scale: 0.99 },
  { dx: '-2px',  dy: '-2px', rot: '-1deg', opacity: 0.88, scale: 1.0  },
  { dx:  '0px',  dy: '0px',  rot:  '0deg', opacity: 1.0,  scale: 1.0  },
];

export default function TarotDeck() {
  return (
    <div className="relative mx-auto float-deck" style={{ width: 160, height: 260 }}>
      {LAYERS.map((l, i) => {
        const isTop = i === LAYERS.length - 1;
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
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-6 rounded-full blur-xl"
        style={{ background: 'rgba(139,92,246,0.48)' }}/>
    </div>
  );
}
