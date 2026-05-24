// ============================================================
// VedaAI Frontend — Shared TypeScript Types
// ============================================================

export interface Question {
  question: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer' | 'True/False';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  options?: string[];
  correctAnswer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  title: string;
  subject: string;
  grade: string;
  duration: string;
  totalMarks: number;
  institution: string;
  sections: Section[];
  generatedAt: string;
}

export interface Difficulty {
  easy: number;
  medium: number;
  hard: number;
}

export interface Assignment {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: Difficulty;
  instructions: string;
  uploadedFile?: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: GeneratedPaper;
  jobId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentStats {
  total: number;
  completed: number;
  processing: number;
  pending: number;
  failed: number;
  avgQuestions: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: 'teacher' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: Difficulty;
  instructions: string;
  file?: File;
}
