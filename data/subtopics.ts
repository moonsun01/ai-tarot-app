// 일부 주제는 카드를 뽑기 전에 "어떤 상황·고민을 볼지" 한 번 더 고르도록 한다.
// 여기서 고른 세부 항목은 API(app/api/tarot/route.ts)의 해석 프롬프트까지 전달되어
// 실제 결과 해석이 달라진다. 세부 선택이 없는 주제(오늘의 총운)는 여기에 넣지 않는다.

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  ClipboardCheck,
  Compass,
  Handshake,
  HeartHandshake,
  MessageCircleHeart,
  Sparkles,
  Sprout,
  Users,
} from 'lucide-react';

export interface SubTopic {
  id: string;
  /** 통일된 라인 아이콘(lucide-react). 화면에서 연보라색으로 렌더링된다. */
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
}

export interface SubTopicGroup {
  /** data/topics.ts 의 Topic.id 와 매칭 */
  topicId: string;
  /** 세부 선택 화면 상단 제목 */
  title: string;
  options: SubTopic[];
}

export const SUBTOPIC_GROUPS: SubTopicGroup[] = [
  {
    topicId: 'love',
    title: '현재 연애 상황을 선택해주세요',
    options: [
      {
        id: 'single',
        icon: Sprout,
        label: '솔로',
        desc: '새로운 인연을 기다리는 중',
        color: 'from-rose-900/30 to-fuchsia-900/20',
      },
      {
        id: 'crush',
        icon: MessageCircleHeart,
        label: '짝사랑',
        desc: '혼자 마음을 키우는 중',
        color: 'from-pink-900/40 to-rose-900/30',
      },
      {
        id: 'some',
        icon: Sparkles,
        label: '썸',
        desc: '설렘과 확신 사이',
        color: 'from-fuchsia-900/40 to-pink-900/30',
      },
      {
        id: 'couple',
        icon: HeartHandshake,
        label: '커플',
        desc: '함께 만들어가는 우리의 이야기',
        color: 'from-rose-900/40 to-pink-900/30',
      },
    ],
  },
  {
    topicId: 'career',
    title: '어떤 고민을 보고 싶나요?',
    options: [
      {
        id: 'study',
        icon: BookOpen,
        label: '학업',
        desc: '공부 흐름과 방향',
        color: 'from-indigo-900/40 to-blue-900/30',
      },
      {
        id: 'exam',
        icon: ClipboardCheck,
        label: '시험',
        desc: '준비 상태와 결과의 흐름',
        color: 'from-blue-900/40 to-sky-900/30',
      },
      {
        id: 'job',
        icon: Compass,
        label: '진로/취업',
        desc: '방향과 다가오는 기회',
        color: 'from-violet-900/40 to-indigo-900/30',
      },
    ],
  },
  {
    topicId: 'social',
    title: '어떤 관계를 보고 싶나요?',
    options: [
      {
        id: 'friend',
        icon: Users,
        label: '대인관계',
        desc: '친구·주변 사람들과의 흐름',
        color: 'from-emerald-900/40 to-teal-900/30',
      },
      {
        id: 'teamwork',
        icon: Handshake,
        label: '팀플/협업',
        desc: '함께 일할 때의 분위기',
        color: 'from-teal-900/40 to-cyan-900/30',
      },
    ],
  },
];

export function getSubTopicGroup(topicId: string | null): SubTopicGroup | undefined {
  if (!topicId) return undefined;
  return SUBTOPIC_GROUPS.find((g) => g.topicId === topicId);
}

export function findSubTopic(topicId: string | null, subId: string | null): SubTopic | undefined {
  if (!subId) return undefined;
  return getSubTopicGroup(topicId)?.options.find((o) => o.id === subId);
}
