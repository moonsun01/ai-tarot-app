import type { LucideIcon } from 'lucide-react';
import { Clover, GraduationCap, Heart, Users } from 'lucide-react';

export interface Topic {
  id: string;
  /** 통일된 라인 아이콘(lucide-react). 화면에서 연보라색으로 렌더링된다. */
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
}

export const TOPICS: Topic[] = [
  {
    id: 'love',
    icon: Heart,
    label: '연애/속마음',
    desc: '그 사람의 마음과 나의 연애운',
    color: 'from-rose-900/40 to-pink-900/30',
  },
  {
    id: 'career',
    icon: GraduationCap,
    label: '학업/진로',
    desc: '학점, 시험, 미래의 운명',
    color: 'from-indigo-900/40 to-blue-900/30',
  },
  {
    id: 'social',
    icon: Users,
    label: '대인관계/팀플',
    desc: '빌런 퇴치, 귀인과의 만남',
    color: 'from-emerald-900/40 to-teal-900/30',
  },
  {
    id: 'luck',
    icon: Clover,
    label: '오늘의 총운',
    desc: '오늘 나에게 찾아올 행운',
    color: 'from-amber-900/40 to-yellow-900/30',
  },
];
