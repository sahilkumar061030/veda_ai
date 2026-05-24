'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema, AssignmentFormSchema } from '@/lib/validations';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useDropzone } from 'react-dropzone';
import {
  FileText,
  Upload,
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Hash,
  Award,
  Brain,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const subjects = [
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Science', label: 'Science' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Biology', label: 'Biology' },
  { value: 'English', label: 'English' },
  { value: 'History', label: 'History' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Economics', label: 'Economics' },
];

const grades = [
  { value: 'Grade 6', label: 'Grade 6' },
  { value: 'Grade 7', label: 'Grade 7' },
  { value: 'Grade 8', label: 'Grade 8' },
  { value: 'Grade 9', label: 'Grade 9' },
  { value: 'Grade 10', label: 'Grade 10' },
  { value: 'Grade 11', label: 'Grade 11' },
  { value: 'Grade 12', label: 'Grade 12' },
  { value: 'Undergraduate', label: 'Undergraduate' },
];

const questionTypes = ['MCQ', 'Short Answer', 'Long Answer', 'True/False'];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { createAssignment, isLoading } = useAssignmentStore();
  const { generationStatus } = useUIStore();
  const [file, setFile] = useState<File | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 });
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<AssignmentFormSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      numberOfQuestions: 10,
      totalMarks: 50,
      difficulty: { easy: 30, medium: 50, hard: 20 },
      questionTypes: [],
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const toggleQuestionType = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    setValue('questionTypes', updated, { shouldValidate: true });
  };

  const updateDifficulty = (level: 'easy' | 'medium' | 'hard', value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    const newDiff = { ...difficulty, [level]: clamped };
    setDifficulty(newDiff);
    setValue('difficulty', newDiff, { shouldValidate: true });
  };

  const onSubmit = async (data: AssignmentFormSchema) => {
    if (selectedTypes.length === 0) {
      toast.error('Please select at least one question type');
      return;
    }

    const diffSum = difficulty.easy + difficulty.medium + difficulty.hard;
    if (diffSum !== 100) {
      toast.error('Difficulty percentages must sum to 100%');
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('grade', data.grade);
      formData.append('dueDate', data.dueDate);
      formData.append('questionTypes', JSON.stringify(selectedTypes));
      formData.append('numberOfQuestions', data.numberOfQuestions.toString());
      formData.append('totalMarks', data.totalMarks.toString());
      formData.append('difficulty', JSON.stringify(difficulty));
      formData.append('instructions', data.instructions || '');
      if (file) {
        formData.append('file', file);
      }

      const assignment = await createAssignment(formData);
      toast.success('Assignment created! Generating questions...');
      router.push(`/dashboard/assignment/${assignment.id || assignment._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create assignment');
      setIsGenerating(false);
    }
  };

  // Show generation progress overlay
  if (isGenerating && generationStatus.status !== 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30"
          >
            <Brain className="h-10 w-10 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {generationStatus.status === 'completed' ? 'Questions Ready!' : 'Generating Questions...'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {generationStatus.message || 'AI is crafting your questions...'}
          </p>

          <ProgressBar progress={generationStatus.progress} showLabel size="lg" className="mb-4" />

          {generationStatus.status === 'completed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-emerald-500 font-medium">Redirecting...</p>
            </motion.div>
          )}

          {generationStatus.status === 'failed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-500 font-medium mb-4">{generationStatus.message}</p>
              <Button onClick={() => setIsGenerating(false)} variant="secondary">
                Try Again
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Assignment</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure your assessment and let AI generate the questions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Input
                label="Assignment Title"
                error={errors.title?.message}
                icon={<FileText className="h-4 w-4" />}
                {...register('title')}
              />
            </div>
            <Select
              label="Subject"
              options={subjects}
              error={errors.subject?.message}
              {...register('subject')}
            />
            <Select
              label="Grade / Class"
              options={grades}
              error={errors.grade?.message}
              {...register('grade')}
            />
            <Input
              label="Due Date"
              type="date"
              icon={<CalendarDays className="h-4 w-4" />}
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />
          </div>
        </Card>

        {/* Question Configuration */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-500" />
            Question Configuration
          </h2>

          {/* Question Types */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Question Types
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {questionTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleQuestionType(type)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                    selectedTypes.includes(type)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.questionTypes && (
              <p className="mt-2 text-xs text-red-500">{errors.questionTypes.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Number of Questions"
              type="number"
              icon={<Hash className="h-4 w-4" />}
              error={errors.numberOfQuestions?.message}
              {...register('numberOfQuestions', { valueAsNumber: true })}
            />
            <Input
              label="Total Marks"
              type="number"
              icon={<Award className="h-4 w-4" />}
              error={errors.totalMarks?.message}
              {...register('totalMarks', { valueAsNumber: true })}
            />
          </div>

          {/* Difficulty Distribution */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Difficulty Distribution
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'easy' as const, label: 'Easy', color: 'emerald' },
                { key: 'medium' as const, label: 'Medium', color: 'amber' },
                { key: 'hard' as const, label: 'Hard', color: 'red' },
              ].map((d) => (
                <div key={d.key} className="text-center">
                  <label className={`block text-xs font-medium text-${d.color}-600 mb-2`}>
                    {d.label}
                  </label>
                  <input
                    type="number"
                    value={difficulty[d.key]}
                    onChange={(e) => updateDifficulty(d.key, parseInt(e.target.value) || 0)}
                    min={0}
                    max={100}
                    className={`w-full text-center px-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all
                      ${d.key === 'easy' ? 'border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5' :
                        d.key === 'medium' ? 'border-amber-200 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-50 dark:bg-amber-500/5' :
                        'border-red-200 focus:ring-red-500/20 focus:border-red-500 bg-red-50 dark:bg-red-500/5'}
                    `}
                  />
                  <span className="text-xs text-gray-400 mt-1 block">%</span>
                </div>
              ))}
            </div>
            {/* Sum indicator */}
            <div className={`mt-3 text-center text-sm font-medium ${
              difficulty.easy + difficulty.medium + difficulty.hard === 100 ? 'text-emerald-500' : 'text-red-500'
            }`}>
              Total: {difficulty.easy + difficulty.medium + difficulty.hard}%
              {difficulty.easy + difficulty.medium + difficulty.hard !== 100 && ' (must be 100%)'}
            </div>
            {/* Visual bar */}
            <div className="mt-3 h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-700">
              <div className="bg-emerald-500 transition-all" style={{ width: `${difficulty.easy}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${difficulty.medium}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${difficulty.hard}%` }} />
            </div>
          </div>
        </Card>

        {/* Additional Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-500" />
            Additional Details
          </h2>

          {/* Instructions */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Additional Instructions (optional)
            </label>
            <textarea
              {...register('instructions')}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="Any specific topics, chapters, or guidelines for the AI..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Reference Material (optional)
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive ? 'Drop your file here...' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, TXT, or DOCX (max 10MB)</p>
            </div>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"
                >
                  <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading || isGenerating}
            icon={<Sparkles className="h-4 w-4" />}
            className="px-8"
          >
            Generate Questions
          </Button>
        </div>
      </form>
    </div>
  );
}
