import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  institution: z.string().min(2, 'Institution name is required'),
});

export const assignmentSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title is too long'),
  subject: z.string().min(1, 'Please select a subject'),
  grade: z.string().min(1, 'Please select a grade'),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z
    .array(z.string())
    .min(1, 'Select at least one question type'),
  numberOfQuestions: z
    .number()
    .min(1, 'Must have at least 1 question')
    .max(100, 'Cannot exceed 100 questions'),
  totalMarks: z
    .number()
    .min(1, 'Total marks must be at least 1')
    .max(500, 'Total marks cannot exceed 500'),
  difficulty: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }).refine((d) => d.easy + d.medium + d.hard === 100, {
    message: 'Difficulty percentages must sum to 100%',
  }),
  instructions: z.string().max(2000, 'Instructions too long').optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AssignmentFormSchema = z.infer<typeof assignmentSchema>;
