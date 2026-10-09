import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle,
  Clock,
  Sparkles,
  Printer
} from 'lucide-react';
import { QuizQuestion, StudentProfile, QuizResultRecord } from '../types';
import { soundManager } from '../utils/audio';

interface Props {
  questions: QuizQuestion[];
  student: StudentProfile;
  onSaveQuizResult: (record: QuizResultRecord) => void;
  onNavigateToReport: () => void;
}

export const QuizView: React.FC<Props> = ({
  questions,
  student,
  onSaveQuizResult,
  onNavigateToReport,
}) => {
  const [examMode, setExamMode] = useState<'instant' | 'exam'>('instant');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [revealInstantFeedback, setRevealInstantFeedback] = useState(false);

  const currentQ = questions[currentIdx];
  const selectedOptionIndex = selectedAnswers[currentQ?.id];

  const handleSelectOption = (optionIdx: number) => {
    soundManager.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));

    if (examMode === 'instant') {
      setRevealInstantFeedback(true);
      if (optionIdx === currentQ.correctIndex) {
        soundManager.playCorrect();
      } else {
        soundManager.playWrong();
      }
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    setRevealInstantFeedback(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    setRevealInstantFeedback(false);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitExam = () => {
    // Calculate final score
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const passed = finalScore >= 60;

    const record: QuizResultRecord = {
      date: new Date().toISOString().split('T')[0],
      score: finalScore,
      total: questions.length,
      percentage: finalScore,
      passed,
      userAnswers: selectedAnswers,
    };

    onSaveQuizResult(record);
    setIsSubmitted(true);

    if (passed) {
      soundManager.playFanfare();
    } else {
      soundManager.playWrong();
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setRevealInstantFeedback(false);
  };

  // Score stats for completed view
  let totalScore = 0;
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctIndex) {
      correctCount += 1;
    }
  });
  totalScore = Math.round((correctCount / questions.length) * 100);

  const answeredCount = Object.keys(selectedAnswers).length;

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-1">
              <span>學號：{student.studentId}</span>
              <span aria-hidden="true">·</span>
              <span>考生：{student.studentName}</span>
              <span aria-hidden="true">·</span>
              <span>{student.classGroup}</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              模擬測驗作答成果結算
            </h2>
          </div>

          <div className="py-4">
            <div className="text-5xl font-extrabold text-stone-900 font-mono tabular-nums">
              {totalScore}
              <span className="text-lg font-normal text-stone-500 ml-1">分</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              答對題數：{correctCount} / {questions.length} 題（及格門檻為 60 分）
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold">
            {totalScore >= 80 ? (
              <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                優等合格：專業法規精通嫻熟
              </span>
            ) : totalScore >= 60 ? (
              <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                考核通過：基礎法規具備，建議複習錯題
              </span>
            ) : (
              <span className="text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
                未達標：建議針對 GHP 與證照比率重新複習
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-stone-100">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重新測驗
            </button>
            <button
              onClick={onNavigateToReport}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              前往查看 / 輸出 PDF 成績報告
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 px-1">
            作答逐題解析與法規依據
          </h3>

          {questions.map((q, idx) => {
            const userAns = selectedAnswers[q.id];
            const isCorrect = userAns === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border p-5 space-y-3 transition-colors ${
                  isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-500 font-mono">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-amber-800 font-medium">
                      {q.categoryLabel}
                    </span>
                  </div>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      答對
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-rose-700 font-medium">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      答錯
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-stone-900 leading-snug">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isRightOption = optIdx === q.correctIndex;
                    const isUserChoice = userAns === optIdx;

                    let optionStyle = 'border-stone-200 text-stone-700 bg-stone-50';
                    if (isRightOption) {
                      optionStyle = 'border-emerald-300 text-emerald-800 bg-emerald-50 font-semibold';
                    } else if (isUserChoice && !isRightOption) {
                      optionStyle = 'border-rose-300 text-rose-800 bg-rose-50 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {isRightOption && <span className="text-[11px] text-emerald-700 ml-1">✓ 正解</span>}
                        {isUserChoice && !isRightOption && <span className="text-[11px] text-rose-700 ml-1">您的選擇</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                  <p className="font-medium text-stone-800">
                    法規解析：{q.explanation}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    出處對應：{q.reference}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mode Selector and Student ID Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-800" />
          <div className="text-xs text-stone-600">
            作答考生：<span className="font-semibold text-stone-900">{student.studentName}</span>
            <span className="text-stone-400 font-mono ml-1">({student.studentId})</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => {
              soundManager.playClick();
              setExamMode('instant');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              examMode === 'instant'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            即時解說模式
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setExamMode('exam');
              setRevealInstantFeedback(false);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              examMode === 'exam'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            全真模擬大考模式
          </button>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          {/* Question Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-mono font-bold text-amber-800 text-sm">
                第 {currentIdx + 1} 題 / 共 {questions.length} 題
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentQ.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400">{currentQ.reference}</span>
            </div>

            <div className="text-xs text-stone-400">
              已完成 {answeredCount} / {questions.length}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedOptionIndex === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctIndex;
              const showResult = examMode === 'instant' && revealInstantFeedback;

              let buttonStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

              if (showResult) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500';
                } else {
                  buttonStyle = 'bg-stone-50/50 border-stone-200 text-stone-400';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-amber-50 border-amber-800 text-amber-950 font-semibold ring-1 ring-amber-800';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 text-left rounded-xl border text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-stone-300 text-stone-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>

                  {showResult && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {showResult && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback Explanation Box */}
          {examMode === 'instant' && revealInstantFeedback && (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
              selectedOptionIndex === currentQ.correctIndex
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-stone-800'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {selectedOptionIndex === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>答對了！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>正解為：({String.fromCharCode(65 + currentQ.correctIndex)}) {currentQ.options[currentQ.correctIndex]}</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Question Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              上一題
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors shadow-2xs"
              >
                下一題
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="flex items-center gap-1 px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
              >
                交卷並結算成績
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Number Quick Jump Grid */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <span className="text-xs font-semibold text-stone-600 block mb-3">題目跳轉導覽：</span>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIdx(idx);
                  setRevealInstantFeedback(false);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isCurrent
                    ? 'bg-amber-800 text-white ring-2 ring-amber-800 ring-offset-1'
                    : isAnswered
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
