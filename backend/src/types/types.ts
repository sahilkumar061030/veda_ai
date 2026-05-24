// ============================================================
// VedaAI Backend — Shared TypeScript Types
// ============================================================

export interface IQuestion {
  question: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer' | 'True/False';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  options?: string[];
  correctAnswer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper {
  title: string;
  subject: string;
  grade: string;
  duration: string;
  totalMarks: number;
  institution: string;
  sections: ISection[];
  generatedAt: Date;
}

export interface IDifficulty {
  easy: number;
  medium: number;
  hard: number;
}

export interface IUploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
}

export interface IAssignmentInput {
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: IDifficulty;
  instructions?: string;
}

export interface IAssignmentStats {
  total: number;
  completed: number;
  processing: number;
  pending: number;
  failed: number;
  avgQuestions: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface SocketEvents {
  'generation:started': { assignmentId: string; message: string };
  'generation:progress': { assignmentId: string; progress: number; message: string };
  'generation:completed': { assignmentId: string; paper: IGeneratedPaper };
  'generation:failed': { assignmentId: string; error: string };
}
