export interface Topic {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  color: string;
  glow: string;
}

export const TOPICS: Topic[] = [
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
