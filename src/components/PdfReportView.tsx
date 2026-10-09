import React from 'react';
import { 
  Printer, 
  Award, 
  CheckCircle2, 
  User, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  FileCheck
} from 'lucide-react';
import { StudentProfile, QuizResultRecord, Flashcard } from '../types';
import { soundManager } from '../utils/audio';

interface Props {
  student: StudentProfile;
  quizResult: QuizResultRecord | null;
  masteredCardsCount: number;
  totalCardsCount: number;
  completedScenariosCount: number;
  totalScenariosCount: number;
  onOpenProfile: () => void;
}

export const PdfReportView: React.FC<Props> = ({
  student,
  quizResult,
  masteredCardsCount,
  totalCardsCount,
  completedScenariosCount,
  totalScenariosCount,
  onOpenProfile,
}) => {
  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const score = quizResult ? quizResult.score : 0;
  const isPassed = quizResult ? quizResult.passed : false;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="print:hidden bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            學習成果報告書暨檢定證明 (PDF 輸出)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            點擊下方「列印 / 另存為 PDF」按鈕，系統已預先最佳化 A4 列印排版樣式。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            修改學生資料
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            列印 / 另存為 PDF
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div 
        id="printable-report"
        className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto space-y-8 text-stone-900"
      >
        {/* Report Header */}
        <div className="border-b-2 border-stone-800 pb-6 text-center space-y-2 relative">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-900">
            餐飲廚藝專業倫理與衛生法規教育檢定
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            「我以當一個廚師為榮」學習成果暨評量證明
          </h1>
          <p className="text-xs text-stone-500">
            Chapter 3 廚師專業定義 · 制服規格 · GHP最新規範 · 技術士證與廚師證管理
          </p>
        </div>

        {/* Student & Assessment Information Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          <div>
            <span className="text-stone-500 block text-[11px]">學生姓名</span>
            <span className="font-bold text-stone-900 text-sm">{student.studentName}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">學生學號</span>
            <span className="font-mono font-bold text-stone-900 text-sm">{student.studentId}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">科系與班級</span>
            <span className="font-medium text-stone-800 text-sm">
              {student.department} / {student.classGroup}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">評量核發日期</span>
            <span className="font-medium text-stone-800 text-sm">{currentDate}</span>
          </div>
        </div>

        {/* Achievement Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1: Quiz Score */}
          <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold">模擬測驗成績</span>
              <FileCheck className="w-4 h-4 text-amber-800" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tabular-nums text-stone-900">
                {quizResult ? score : '--'}
              </span>
              <span className="text-xs text-stone-500">/ 100 分</span>
            </div>
            <div className="text-[11px]">
              {quizResult ? (
                isPassed ? (
                  <span className="text-emerald-700 font-semibold">✓ 評鑑通過（及格門檻 60 分）</span>
                ) : (
                  <span className="text-rose-600 font-semibold">✕ 未達通過門檻</span>
                )
              ) : (
                <span className="text-stone-400">尚未完成模擬測驗</span>
              )}
            </div>
          </div>

          {/* Metric 2: Flashcards Mastered */}
          <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold">學習字卡熟記</span>
              <BookOpen className="w-4 h-4 text-amber-800" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tabular-nums text-stone-900">
                {masteredCardsCount}
              </span>
              <span className="text-xs text-stone-500">/ {totalCardsCount} 張</span>
            </div>
            <div className="text-[11px] text-stone-500">
              概念精熟率 {Math.round((masteredCardsCount / totalCardsCount) * 100)}%
            </div>
          </div>

          {/* Metric 3: Scenarios Completed */}
          <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold">情境模擬決策</span>
              <ShieldCheck className="w-4 h-4 text-amber-800" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tabular-nums text-stone-900">
                {completedScenariosCount}
              </span>
              <span className="text-xs text-stone-500">/ {totalScenariosCount} 案例</span>
            </div>
            <div className="text-[11px] text-stone-500">
              完成實務現場法規決策分析
            </div>
          </div>
        </div>

        {/* Essential Legal Knowledge Summary (Quick Reference Sheet) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-2">
            課程重點法規與檢定核心知識盤點
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Box 1: 制服與職稱 */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <h4 className="font-bold text-amber-900">一、服裝規範與鈕扣等級</h4>
              <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                <li>服裝以白色為首；帽子須完全包住頭髮及髮根。</li>
                <li>圍裙過膝、工作褲長至踝關節、黑鞋著襪。</li>
                <li><strong>女性廚師：</strong>以安全為第一訴求，絕不可穿短褲及裙子。</li>
                <li><strong>場域限制：</strong>制服只可以在操作場所穿著。</li>
                <li>單排白扣（練習生/一般廚師）、雙排白扣（頭爐/頭砧）。</li>
                <li>單排黑扣（副主廚）、雙排黑扣（主廚，一個廚房只有一位）。</li>
                <li>雙排金扣翻金領（國家授證金廚獎廚師）。</li>
              </ul>
            </div>

            {/* Box 2: 最新 GHP 修正 */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <h4 className="font-bold text-amber-900">二、GHP 最新四大修正（114年6月4日）</h4>
              <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                <li><strong>刪除結核病檢查：</strong>健檢不再要求胸部X光/結核病。</li>
                <li><strong>保留健檢項目：</strong>一般體檢、A型肝炎、傷寒、手部膿瘡外傷。</li>
                <li><strong>教育訓練時數：</strong>新進人員及每年持續教育皆須 3 小時以上。</li>
                <li><strong>調理作業配戴口罩：</strong>調理即食食品全程配戴口罩為基本要求。</li>
                <li><strong>找錢手部分流：</strong>接觸即食食品的手不得同時接觸錢幣或污染源。</li>
              </ul>
            </div>

            {/* Box 3: 技術士證 vs 廚師證 */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <h4 className="font-bold text-amber-900">三、烹調技術士證 vs 廚師證</h4>
              <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                <li><strong>烹調技術士證：</strong>勞動部發照、資格證明、終生永久有效。</li>
                <li><strong>廚師證：</strong>衛福部主管、執業證明、有效期限四年。</li>
                <li><strong>展延條件：</strong>每四年展延乙次，每年至少 8 小時衛生講習。</li>
                <li><strong>申辦路徑：</strong>加入地方餐飲工會/公會 → 向認可機構換發。</li>
                <li><strong>金帽獎：</strong>TFDA主辦，每年 10/20 廚師節頒發最高榮譽。</li>
              </ul>
            </div>

            {/* Box 4: 法定持證人員比率 */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <h4 className="font-bold text-amber-900">四、餐飲從業人員法定持證比率標準</h4>
              <ul className="space-y-1 text-stone-700 leading-relaxed list-disc list-inside">
                <li>觀光旅館之餐飲業：<strong>85%</strong>（要求最高）</li>
                <li>承攬機構 / 學校午餐 / 筵席餐廳 / 外燴飲食：<strong>75%</strong></li>
                <li>中央廚房式餐飲業：<strong>70%</strong></li>
                <li>自助餐飲業：<strong>60%</strong></li>
                <li>一般餐館餐飲業：<strong>50%</strong></li>
                <li>前店後廠小型烘焙業：<strong>30%</strong></li>
                <li>例外：連鎖門市僅依SOP復熱或自助火鍋不強制要求技術士證。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification & Signatures */}
        <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-4">
            <span className="text-stone-500 block">學生本人簽名確認：</span>
            <div className="border-b border-stone-300 h-10 flex items-end font-mono">
              {student.studentName} ({student.studentId})
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-stone-500 block">指導教師 / 評量評審簽章：</span>
            <div className="border-b border-stone-300 h-10 flex items-end text-stone-400">
              簽章處（核章完成後存檔）
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
