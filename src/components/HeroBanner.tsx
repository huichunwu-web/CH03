import React from 'react';
import { BookOpen, HelpCircle, Compass, FileText, ChevronRight, Award } from 'lucide-react';
import { StudentProfile } from '../types';
import { TabType } from './Navbar';
import { soundManager } from '../utils/audio';

interface Props {
  student: StudentProfile;
  onNavigate: (tab: TabType) => void;
  onOpenProfile: () => void;
}

export const HeroBanner: React.FC<Props> = ({ student, onNavigate, onOpenProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Column: Editorial Hero & Course Info */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold">
              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-mono text-[11px]">
                Chapter 3
              </span>
              <span>餐飲廚藝專業倫理與法規</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400">華立圖書教材</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              我以當一個廚師為榮
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              探索廚師的專業定義、制服鈕扣階級、健康檢查與 114 年最新 GHP 規範、烹調技術士證與廚師證之區別，以及優良廚師職業道德。
            </p>
          </div>

          {/* Student Welcome Pill */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-xs shrink-0">
                {student.studentName.slice(0, 1)}
              </div>
              <div className="text-xs">
                <span className="text-stone-500 block">目前學習者</span>
                <span className="font-bold text-stone-900">{student.studentName}</span>
                <span className="text-stone-400 font-mono ml-2">({student.studentId})</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenProfile();
              }}
              className="text-xs text-amber-800 hover:text-amber-900 font-semibold transition-colors"
            >
              編輯學籍
            </button>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('flashcards');
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              開始研讀字卡
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('quiz');
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              進行全真測驗
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('scenario');
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              實務情境分析
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Image with robust fallback */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-stone-900">
          <img
            src="/src/assets/images/hero_culinary_chef_1791518853989.jpg"
            alt="專業廚師料理與食品安全衛生作業"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image and fall back to styled decorative background
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent flex flex-col justify-end p-6">
            <span className="text-amber-300 font-mono text-xs font-semibold tracking-wider">
              PROFESSIONAL CULINARY ETHICS
            </span>
            <p className="text-white text-xs sm:text-sm font-medium mt-1">
              持刀、持鏟為職志 · 衛生為本 · 以客為尊
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
