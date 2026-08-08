'use client';

import { useState, useEffect } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  animDelay: string;
  animDuration: string;
}

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.55 + 0.15,
        animDelay: `${Math.random() * 5}s`,
        animDuration: `${2 + Math.random() * 3}s`,
      })),
    );
  }, []);

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
