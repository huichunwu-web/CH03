import React, { useState, useEffect } from 'react';
import { StudentProfile, QuizResultRecord } from './types';
import { FLASHCARDS, QUIZ_QUESTIONS, SCENARIO_CASES } from './data/curriculumData';
import { soundManager } from './utils/audio';
import { Navbar, TabType } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ScenarioView } from './components/ScenarioView';
import { PdfReportView } from './components/PdfReportView';
import { StudentProfileModal } from './components/StudentProfileModal';

const DEFAULT_PROFILE: StudentProfile = {
  studentId: '1132001',
  studentName: '陳志豪',
  department: '餐飲廚藝管理科',
  classGroup: '二年甲班',
};

export default function App() {
  // Student Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('chef_student_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('flashcards');

  // Audio Mute State
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.isMuted());

  // Mastered Flashcards
  const [masteredCardIds, setMasteredCardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chef_mastered_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Latest Quiz Result
  const [quizResult, setQuizResult] = useState<QuizResultRecord | null>(() => {
    try {
      const saved = localStorage.getItem('chef_quiz_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Completed Scenarios
  const [completedScenarios, setCompletedScenarios] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chef_completed_scenarios');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save profile changes
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem('chef_student_profile', JSON.stringify(newProfile));
  };

  // Toggle Mastered Card
  const handleToggleMasteredCard = (cardId: string) => {
    setMasteredCardIds((prev) => {
      const updated = prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId];
      localStorage.setItem('chef_mastered_cards', JSON.stringify(updated));
      return updated;
    });
  };

  // Save Quiz Result
  const handleSaveQuizResult = (record: QuizResultRecord) => {
    setQuizResult(record);
    localStorage.setItem('chef_quiz_result', JSON.stringify(record));
  };

  // Complete Scenario
  const handleCompleteScenario = (scenarioId: string) => {
    setCompletedScenarios((prev) => {
      if (prev.includes(scenarioId)) return prev;
      const updated = [...prev, scenarioId];
      localStorage.setItem('chef_completed_scenarios', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const newState = soundManager.toggleMute();
    setIsMuted(newState);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero banner shown on main view tabs */}
        <HeroBanner
          student={profile}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Tab View Renderer */}
        {activeTab === 'flashcards' && (
          <FlashcardView
            cards={FLASHCARDS}
            masteredCardIds={masteredCardIds}
            onToggleMastered={handleToggleMasteredCard}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            questions={QUIZ_QUESTIONS}
            student={profile}
            onSaveQuizResult={handleSaveQuizResult}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'scenario' && (
          <ScenarioView
            scenarios={SCENARIO_CASES}
            completedScenarios={completedScenarios}
            onCompleteScenario={handleCompleteScenario}
          />
        )}

        {activeTab === 'report' && (
          <PdfReportView
            student={profile}
            quizResult={quizResult}
            masteredCardsCount={masteredCardIds.length}
            totalCardsCount={FLASHCARDS.length}
            completedScenariosCount={completedScenarios.length}
            totalScenariosCount={SCENARIO_CASES.length}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="print:hidden border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-stone-700">我以當一個廚師為榮</span>
            <span className="mx-2 text-stone-300">·</span>
            <span>華立圖書 餐飲專業倫理與法規互動研習系統</span>
          </div>
          <div className="text-stone-400">
            涵蓋 GHP 114年最新修正 · 廚師制服階級 · 體檢規定 · 烹調技術士證與廚師證管理比率
          </div>
        </div>
      </footer>

      {/* Student Profile Setting Modal */}
      <StudentProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
