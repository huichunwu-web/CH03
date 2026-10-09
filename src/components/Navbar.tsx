import React from 'react';
import { Volume2, VolumeX, User, BookOpen, HelpCircle, Compass, FileText } from 'lucide-react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';

export type TabType = 'flashcards' | 'quiz' | 'scenario' | 'report';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  profile: StudentProfile;
  onOpenProfile: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  profile,
  onOpenProfile,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-800 flex items-center justify-center text-amber-50 font-bold text-sm shadow-xs">
            廚
          </div>
          <button
            onClick={() => onTabChange('flashcards')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">
              我以當一個廚師為榮
            </span>
            <span className="hidden sm:inline-block text-xs text-stone-400 ml-2 font-normal whitespace-nowrap">
              專業倫理與法規學習平台
            </span>
          </button>
        </div>

        {/* Zone 2: Clean 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('flashcards');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'flashcards'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            學習字卡
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('quiz');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'quiz'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            模擬測驗
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('scenario');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'scenario'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            情境分析
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('report');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'report'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            學習報表 (PDF)
          </button>
        </nav>

        {/* Zone 3: 1 Primary Actions Group */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Effect Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-stone-100 text-stone-400 border-stone-200 hover:text-stone-600'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title={isMuted ? '音效已靜音（點擊開啟）' : '音效已開啟（點擊靜音）'}
            aria-label="切換音效"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Student Profile Quick View & Trigger */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:border-amber-700/60 transition-colors shadow-2xs group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800 flex items-center justify-center transition-colors">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left text-xs leading-tight hidden sm:block">
              <span className="font-semibold text-stone-800 block truncate max-w-[90px]">
                {profile.studentName}
              </span>
              <span className="font-mono text-stone-400 text-[11px] block">
                {profile.studentId}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50/90 py-1.5 px-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('flashcards');
          }}
          className={`flex flex-col items-center py-1 px-2 text-xs ${
            activeTab === 'flashcards' ? 'text-amber-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          字卡
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('quiz');
          }}
          className={`flex flex-col items-center py-1 px-2 text-xs ${
            activeTab === 'quiz' ? 'text-amber-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          測驗
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('scenario');
          }}
          className={`flex flex-col items-center py-1 px-2 text-xs ${
            activeTab === 'scenario' ? 'text-amber-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          情境
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('report');
          }}
          className={`flex flex-col items-center py-1 px-2 text-xs ${
            activeTab === 'report' ? 'text-amber-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          報表
        </button>
      </div>
    </header>
  );
};
