export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  code?: string | null;
}

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: UserAnswer[];
  completedAt: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'project' | 'milestone';
  status: 'completed' | 'in-progress' | 'pending';
  prerequisites?: string[];
  estimatedTime?: number;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool';
  url: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ProgressData {
  completedSkills: string[];
  currentLevel: number;
  experiencePoints: number;
  badges: Badge[];
  streakDays: number;
  totalTimeSpent: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; message?: string };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'teal' | 'red' | 'amber';
  text?: string;
}

export interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}
