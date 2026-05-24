import mongoose, { Schema, Document } from 'mongoose';
import { IGeneratedPaper, IDifficulty, IUploadedFile } from '../types/types';

export interface IAssignment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  grade: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: IDifficulty;
  instructions: string;
  uploadedFile?: IUploadedFile;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: IGeneratedPaper;
  jobId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['MCQ', 'Short Answer', 'Long Answer', 'True/False'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    marks: { type: Number, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: [questionSchema],
  },
  { _id: false }
);

const generatedPaperSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    duration: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    institution: { type: String, default: 'VedaAI Assessment' },
    sections: [sectionSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    questionTypes: {
      type: [String],
      required: [true, 'At least one question type is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one question type must be selected',
      },
    },
    numberOfQuestions: {
      type: Number,
      required: [true, 'Number of questions is required'],
      min: [1, 'Must have at least 1 question'],
      max: [100, 'Cannot exceed 100 questions'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be at least 1'],
    },
    difficulty: {
      easy: { type: Number, required: true, min: 0, max: 100 },
      medium: { type: Number, required: true, min: 0, max: 100 },
      hard: { type: Number, required: true, min: 0, max: 100 },
    },
    instructions: {
      type: String,
      default: '',
      maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
    },
    uploadedFile: {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      path: String,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    generatedPaper: generatedPaperSchema,
    jobId: String,
    error: String,
  },
  {
    timestamps: true,
  }
);

// Compound index for user queries
assignmentSchema.index({ userId: 1, createdAt: -1 });
assignmentSchema.index({ userId: 1, status: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
export default Assignment;
