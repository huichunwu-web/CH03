export interface StudentProfile {
  studentId: string;
  studentName: string;
  department: string;
  classGroup: string;
}

export type ContentCategory = 
  | 'definition_uniform' 
  | 'ranks_buttons' 
  | 'health_ghp' 
  | 'certificates_ratios' 
  | 'awards_ethics';

export interface Flashcard {
  id: string;
  category: ContentCategory;
  categoryLabel: string;
  term: string;
  definition: string;
  keyPoints: string[];
  lawOrRule?: string;
  page: string;
}

export interface QuizQuestion {
  id: string;
  category: ContentCategory;
  categoryLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  reference: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ScenarioChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  score: number;
  feedback: string;
  regulationBasis: string;
}

export interface ScenarioCase {
  id: string;
  title: string;
  context: string;
  workplace: string;
  inspectionTask: string;
  choices: ScenarioChoice[];
  summaryLesson: string;
}

export interface QuizResultRecord {
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  userAnswers: { [questionId: string]: number };
}
