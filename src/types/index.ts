// Shared types for the application

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  level: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeTaken?: number;
  hintUsed?: boolean;
}

export interface QuestionSet {
  id: string;
  name: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  completed: number;
  description: string;
}

export interface Metrics {
  accuracy: number;
  averageTimePerQuestion: number;
  totalQuestions: number;
  hintsTaken: number;
  topicMetrics: TopicMetric[];
  sessionMetrics: SessionMetric[];
}

export interface TopicMetric {
  topic: string;
  accuracy: number;
  averageTime: number;
  questionsAttempted: number;
  hintsTaken: number;
}

export interface SessionMetric {
  date: string;
  questions: number;
  accuracy: number;
  avgTime: number;
  hints: number;
}

export interface QuizResult {
  setId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  hintsUsed: number;
  completedAt: string;
}

