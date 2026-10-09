import React, { useState } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  Shuffle, 
  LayoutGrid, 
  Maximize2,
  BookOpen
} from 'lucide-react';
import { Flashcard, ContentCategory } from '../types';
import { soundManager } from '../utils/audio';

interface Props {
  cards: Flashcard[];
  masteredCardIds: string[];
  onToggleMastered: (id: string) => void;
}

export const FlashcardView: React.FC<Props> = ({
  cards,
  masteredCardIds,
  onToggleMastered,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  // Filter cards
  const filteredCards = cards.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );

  // Safe current index
  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex];

  const handleFlip = () => {
    soundManager.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (safeIndex < filteredCards.length - 1) {
      soundManager.playClick();
      setIsFlipped(false);
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      soundManager.playClick();
      setIsFlipped(false);
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleShuffle = () => {
    soundManager.playClick();
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(randomIndex);
  };

  const categories: { key: ContentCategory | 'all'; label: string }[] = [
    { key: 'all', label: '全部字卡' },
    { key: 'definition_uniform', label: '定義與穿著' },
    { key: 'ranks_buttons', label: '職稱與鈕扣' },
    { key: 'health_ghp', label: '體檢與GHP' },
    { key: 'certificates_ratios', label: '證照與比率' },
    { key: 'awards_ethics', label: '榮譽與倫理' },
  ];

  const masteredCount = filteredCards.filter((c) => masteredCardIds.includes(c.id)).length;
  const progressPercent = filteredCards.length > 0 
    ? Math.round((masteredCount / filteredCards.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.key);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-amber-800 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode & Shuffle Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode(viewMode === 'single' ? 'grid' : 'single');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            {viewMode === 'single' ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>切換矩陣總覽</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>專注單卡模式</span>
              </>
            )}
          </button>

          {viewMode === 'single' && (
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              title="隨機抽卡"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>隨機抽卡</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-white px-5 py-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <span className="font-semibold text-stone-800">
            掌握進度：{masteredCount} / {filteredCards.length} 張
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>熟記率 {progressPercent}%</span>
        </div>
        <div className="w-full sm:w-64 h-2 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mode 1: Single Focus Card Mode */}
      {viewMode === 'single' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Wrapper */}
          <div 
            onClick={handleFlip}
            className="min-h-[340px] bg-white rounded-2xl border-2 border-stone-200 hover:border-amber-700/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer p-8 flex flex-col justify-between relative group select-none"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-medium text-amber-800">{currentCard.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{currentCard.page}</span>
                {currentCard.lawOrRule && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-400">{currentCard.lawOrRule}</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playCorrect();
                  onToggleMastered(currentCard.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  masteredCardIds.includes(currentCard.id)
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-stone-50 text-stone-500 border border-stone-200 hover:text-stone-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{masteredCardIds.includes(currentCard.id) ? '已熟記' : '標記熟記'}</span>
              </button>
            </div>

            {/* Card Center Content: Front vs Back */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              {!isFlipped ? (
                /* Front Side: Question / Term */
                <div className="space-y-4">
                  <span className="inline-block text-xs uppercase tracking-wider text-amber-800/80 font-bold bg-amber-50 px-2.5 py-0.5 rounded">
                    考點名稱
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    {currentCard.term}
                  </h3>
                  <p className="text-xs text-stone-400 flex items-center justify-center gap-1 pt-4">
                    <RotateCw className="w-3.5 h-3.5" />
                    點擊卡片翻面查看完整解析與法規細節
                  </p>
                </div>
              ) : (
                /* Back Side: Definition & Key Points */
                <div className="space-y-4 text-left w-full">
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/50">
                    <span className="text-xs font-semibold text-amber-900 block mb-1">核心定義與標準</span>
                    <p className="text-sm font-medium text-stone-800 leading-relaxed">
                      {currentCard.definition}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-stone-600 block">法規關鍵指標：</span>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {currentCard.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-400">
              <span>
                第 {safeIndex + 1} / {filteredCards.length} 張
              </span>
              <span className="group-hover:text-amber-800 transition-colors flex items-center gap-1 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                {isFlipped ? '再點一下翻回正面' : '點擊翻牌'}
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              上一張
            </button>

            <button
              onClick={handleFlip}
              className="px-6 py-2.5 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
            >
              翻轉卡片
            </button>

            <button
              onClick={handleNext}
              disabled={safeIndex === filteredCards.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            >
              下一張
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Grid Overview Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card, idx) => {
            const isMastered = masteredCardIds.includes(card.id);
            return (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col justify-between space-y-4 hover:border-amber-700/50 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-medium text-amber-800">{card.categoryLabel}</span>
                    <span>{card.page}</span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 mb-2">
                    {card.term}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3">
                    {card.definition}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-stone-100">
                    {card.keyPoints.slice(0, 2).map((kp, kIdx) => (
                      <p key={kIdx} className="text-[11px] text-stone-500 truncate flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-stone-400" />
                        {kp}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedCategory(card.category);
                      setCurrentIndex(filteredCards.findIndex((c) => c.id === card.id));
                      setViewMode('single');
                      setIsFlipped(false);
                    }}
                    className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    深入練習
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playCorrect();
                      onToggleMastered(card.id);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      isMastered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-stone-50 text-stone-500 border border-stone-200 hover:text-stone-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {isMastered ? '已熟記' : '標記'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
