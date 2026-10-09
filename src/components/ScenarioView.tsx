import React, { useState } from 'react';
import { 
  Building2, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { ScenarioCase } from '../types';
import { soundManager } from '../utils/audio';

interface Props {
  scenarios: ScenarioCase[];
  completedScenarios: string[];
  onCompleteScenario: (id: string) => void;
}

export const ScenarioView: React.FC<Props> = ({
  scenarios,
  completedScenarios,
  onCompleteScenario,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(scenarios[0]?.id || '');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const currentCase = scenarios.find((s) => s.id === selectedCaseId) || scenarios[0];
  const selectedChoice = currentCase.choices.find((c) => c.id === selectedChoiceId);

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    const choice = currentCase.choices.find((c) => c.id === choiceId);
    if (choice?.isCorrect) {
      soundManager.playCorrect();
      onCompleteScenario(currentCase.id);
    } else {
      soundManager.playWrong();
    }
  };

  const handleSwitchCase = (caseId: string) => {
    soundManager.playClick();
    setSelectedCaseId(caseId);
    setSelectedChoiceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Case Navigation Pills */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            餐飲實務情境決策分析
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            模擬主廚、衛生督導與餐廳主管在現場面對稽查、人事升遷、證照比率查核與證照展延之真實決策。
          </p>
        </div>

        {/* Case selector tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {scenarios.map((sc, idx) => {
            const isSelected = sc.id === currentCase.id;
            const isDone = completedScenarios.includes(sc.id);

            return (
              <button
                key={sc.id}
                onClick={() => handleSwitchCase(sc.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-mono font-semibold">案例 0{idx + 1}</span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      已通關
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {sc.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Case Simulation Card */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        {/* Case Context Header */}
        <div className="p-6 sm:p-8 bg-stone-900 text-stone-100 space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300">
            <span className="flex items-center gap-1 font-semibold">
              <Building2 className="w-4 h-4" />
              {currentCase.workplace}
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="flex items-center gap-1 text-stone-300">
              <Scale className="w-4 h-4" />
              專業倫理與法令查證
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {currentCase.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            {currentCase.context}
          </p>
        </div>

        {/* Inspection Task & Interactive Choices */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <ShieldCheck className="w-5 h-5 text-amber-800" />
            <span>情境處置任務：{currentCase.inspectionTask}</span>
          </div>

          {/* Choices list */}
          <div className="space-y-3">
            {currentCase.choices.map((choice, cIdx) => {
              const isPicked = selectedChoiceId === choice.id;

              let style = 'border-stone-200 bg-white hover:border-amber-700/50 hover:bg-stone-50 text-stone-800';

              if (selectedChoiceId) {
                if (choice.isCorrect) {
                  style = 'border-emerald-400 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500';
                } else if (isPicked && !choice.isCorrect) {
                  style = 'border-rose-300 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                } else {
                  style = 'border-stone-200 bg-stone-50/50 text-stone-400';
                }
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all text-sm cursor-pointer flex items-start justify-between gap-3 ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-700 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-stone-200">
                      {cIdx + 1}
                    </span>
                    <span className="leading-relaxed">{choice.text}</span>
                  </div>

                  {selectedChoiceId && (
                    <div className="shrink-0 mt-1">
                      {choice.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isPicked ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Decision Feedback Box */}
          {selectedChoice && (
            <div
              className={`p-5 rounded-xl border space-y-2 transition-all ${
                selectedChoice.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedChoice.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>處置精準合規！</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>決策存有法規風險！</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {selectedChoice.feedback}
              </p>
              <div className="pt-2 border-t border-black/5 text-xs text-stone-600">
                <span className="font-semibold">法規依據：</span>
                {selectedChoice.regulationBasis}
              </div>
            </div>
          )}

          {/* Summary takeaway */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/60 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-800">
              <span className="font-bold text-amber-950 block mb-0.5">教材重點提示與反思：</span>
              {currentCase.summaryLesson}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
