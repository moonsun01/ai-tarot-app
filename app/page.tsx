'use client';

import { useState } from 'react';
import StarField from '@/components/StarField';
import TarotDeck from '@/components/TarotDeck';
import ResultModal from '@/components/ResultModal';
import { TOPICS } from '@/data/topics';
import { getSubTopicGroup, findSubTopic } from '@/data/subtopics';
import { ARCANA } from '@/data/arcana';

// 카드 선택 화면에서는 모든 카드 뒷면을 동일하게 표시해
// 심볼로 특정 카드를 유추할 수 없도록 한다.
const CARD_BACK_SYMBOL = '✦';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  // 세부 선택이 필요한 주제(연애/학업·진로/대인관계)에서 사용자가 고른 세부 항목 id
  const [subChoice, setSubChoice] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleTopicClick = (topicId: string) => {
    setSelectedTopic(topicId);
    setSubChoice(null);
    setSelectedCards([]);
    setShowModal(false);
  };

  const handleSubChoiceClick = (subId: string) => {
    setSubChoice(subId);
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
    setSubChoice(null);
  };

  const activeTopic = TOPICS.find((t) => t.id === selectedTopic);
  const subGroup = getSubTopicGroup(selectedTopic);
  const activeSubTopic = findSubTopic(selectedTopic, subChoice);
  // 세부 선택 그룹이 있는 주제는 카드를 뽑기 전에 세부 항목을 먼저 고르도록 한다.
  const needsSubChoice = !!subGroup && !subChoice;
  const allSelected = selectedCards.length === 3;

  return (
    <div className="min-h-screen bg-[#06000f] text-white relative overflow-x-hidden">
      <StarField />

      <main className="relative z-10 flex flex-col items-center py-12 px-4">

        {/* Title */}
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-7 w-full max-w-sm">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-600/40" />
          <span className="text-purple-500/50 text-xs tracking-widest">✦ ✦ ✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-600/40" />
        </div>

        {!selectedTopic ? (
          /* Topic selection */
          <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
            <TarotDeck />
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
                    <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${topic.glow})` }}>
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

        ) : needsSubChoice && subGroup ? (
          /* 세부 주제 선택 (연애 상황 / 학업·진로 고민 / 관계 종류 등 중간 단계) */
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl fade-up">

            <div className="flex items-center gap-3">
              <span
                className="px-5 py-2 rounded-full text-lg font-bold text-purple-100 glass-card"
                style={{ animationDuration: '2s' }}
              >
                {activeTopic?.emoji} {activeTopic?.label}
              </span>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-xs text-purple-500 hover:text-purple-300 border border-purple-800/60 hover:border-purple-600/60 px-3 py-1.5 rounded-full transition-colors"
              >
                다시 선택
              </button>
            </div>

            <p className="text-center text-purple-300/45 text-xs tracking-[0.25em] uppercase">
              {subGroup.title}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              {subGroup.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSubChoiceClick(option.id)}
                  className={`glass-card group flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition-all duration-300 bg-gradient-to-br ${option.color}`}
                >
                  <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${option.glow})` }}>
                    {option.emoji}
                  </span>
                  <span className="text-base font-bold text-purple-100 group-hover:text-white transition-colors">
                    {option.label}
                  </span>
                  <span className="text-xs text-purple-300/60 leading-relaxed group-hover:text-purple-300/80 transition-colors">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

        ) : (
          /* Card selection */
          <div className="flex flex-col items-center gap-6 w-full max-w-3xl fade-up">

            <div className="flex items-center gap-3">
              <span
                className="px-5 py-2 rounded-full text-lg font-bold text-purple-100 glass-card"
                style={{ animationDuration: '2s' }}
              >
                {activeTopic?.emoji} {activeTopic?.label}
                {activeSubTopic ? ` · ${activeSubTopic.label}` : ''}
              </span>
              <button
                onClick={() => {
                  if (subGroup) {
                    setSubChoice(null);
                  } else {
                    setSelectedTopic(null);
                  }
                  setSelectedCards([]);
                }}
                className="text-xs text-purple-500 hover:text-purple-300 border border-purple-800/60 hover:border-purple-600/60 px-3 py-1.5 rounded-full transition-colors"
              >
                다시 선택
              </button>
            </div>

            <p className="text-purple-300/60 text-sm text-center">
              {allSelected
                ? '✨ 카드 3장이 선택되었습니다! 이제 결과를 확인해보세요.'
                : `마음이 끌리는 카드를 ${3 - selectedCards.length}장 더 골라주세요`}
            </p>

            <div className="glass-card w-full rounded-3xl p-5" style={{ animationDuration: '4s' }}>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-2.5">
                {Array.from({ length: ARCANA.length }, (_, i) => {
                  const isSelected = selectedCards.includes(i);
                  const isDisabled = !isSelected && allSelected;
                  const selOrder = selectedCards.indexOf(i) + 1;

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
                            {CARD_BACK_SYMBOL}
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

      {showModal && selectedTopic && selectedCards.length === 3 && (
        <ResultModal
          topicId={selectedTopic}
          subTopic={subChoice}
          cardIndices={selectedCards}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
