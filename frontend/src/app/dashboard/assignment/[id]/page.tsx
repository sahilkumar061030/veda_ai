'use client';

import React, { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useUIStore } from '@/store/uiStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { GeneratedPaper, Section, Question } from '@/types';
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  Copy,
  CheckCircle2,
  Brain,
  Clock,
  Award,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AssignmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const paperRef = useRef<HTMLDivElement>(null);
  const { currentAssignment, isLoading, fetchAssignment, regenerateAssignment } = useAssignmentStore();
  const { generationStatus } = useUIStore();

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
    }
  }, [id, fetchAssignment]);

  // Re-fetch when generation completes
  useEffect(() => {
    if (generationStatus.assignmentId === id && generationStatus.status === 'completed') {
      fetchAssignment(id);
    }
  }, [generationStatus, id, fetchAssignment]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    if (!currentAssignment?.generatedPaper) return;
    const paper = currentAssignment.generatedPaper;
    let text = `${paper.title}\n${paper.subject} | ${paper.grade}\nTotal Marks: ${paper.totalMarks} | Duration: ${paper.duration}\n\n`;

    paper.sections.forEach((section) => {
      text += `${section.title}\n${section.instruction}\n\n`;
      section.questions.forEach((q, qi) => {
        text += `${qi + 1}. ${q.question} [${q.marks} marks] (${q.difficulty})\n`;
        if (q.options) {
          q.options.forEach((opt) => {
            text += `   ${opt}\n`;
          });
        }
        text += '\n';
      });
    });

    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleRegenerate = async () => {
    try {
      await regenerateAssignment(id);
      toast.success('Regeneration started!');
    } catch {
      toast.error('Failed to regenerate');
    }
  };

  const handleDownloadPDF = () => {
    // Use print as PDF fallback
    window.print();
    toast.success('Use "Save as PDF" in the print dialog');
  };

  // Loading state
  if (isLoading && !currentAssignment) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );
  }

  // Processing state
  if (currentAssignment?.status === 'processing' || currentAssignment?.status === 'pending') {
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
            Generating Questions...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {generationStatus.message || 'AI is crafting your questions. This usually takes 15-30 seconds.'}
          </p>
          <ProgressBar
            progress={generationStatus.assignmentId === id ? generationStatus.progress : 15}
            showLabel
            size="lg"
          />
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait...
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (currentAssignment?.status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😔</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generation Failed</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {currentAssignment.error || 'Something went wrong. Please try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={handleRegenerate} icon={<RefreshCw className="h-4 w-4" />}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const paper = currentAssignment?.generatedPaper;
  if (!paper) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No generated paper found.</p>
        <Button onClick={() => router.push('/dashboard')} variant="secondary" className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy} icon={<Copy className="h-4 w-4" />}>
            Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
            Print
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPDF} icon={<Download className="h-4 w-4" />}>
            Download PDF
          </Button>
          <Button size="sm" onClick={handleRegenerate} icon={<RefreshCw className="h-4 w-4" />}>
            Regenerate
          </Button>
        </div>
      </div>

      {/* Question Paper */}
      <Card className="print-paper overflow-hidden">
        <div ref={paperRef} className="p-8 sm:p-12">
          {/* Institution Header */}
          <div className="text-center border-b-2 border-gray-900 dark:border-white pb-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {paper.institution || 'VedaAI Assessment'}
            </h1>
            <div className="mt-3 h-px bg-gray-300 dark:bg-gray-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
              {paper.title}
            </h2>
          </div>

          {/* Paper Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500 no-print" />
              <span className="text-gray-500">Subject:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paper.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Grade:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paper.grade}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500 no-print" />
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paper.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-500 no-print" />
              <span className="text-gray-500">Marks:</span>
              <span className="font-medium text-gray-900 dark:text-white">{paper.totalMarks}</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Name:</span>
              <span className="flex-1 border-b border-dashed border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Roll No.:</span>
              <span className="flex-1 border-b border-dashed border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Section:</span>
              <span className="flex-1 border-b border-dashed border-gray-300 dark:border-gray-600" />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 text-sm">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">General Instructions:</p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>All questions are compulsory unless stated otherwise.</li>
              <li>Read each question carefully before answering.</li>
              <li>Marks for each question are indicated on the right.</li>
            </ul>
          </div>

          {/* Sections */}
          {paper.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-10">
              {/* Section Header */}
              <div className="border-b-2 border-indigo-500 pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                  {section.instruction}
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {section.questions.map((question, qIndex) => {
                  const globalIndex = paper.sections
                    .slice(0, sectionIndex)
                    .reduce((sum, s) => sum + s.questions.length, 0) + qIndex + 1;

                  return (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.05 }}
                      className="group"
                    >
                      <div className="flex gap-3">
                        <span className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 min-w-[2rem]">
                          Q{globalIndex}.
                        </span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                              {question.question}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge
                                variant={
                                  question.difficulty === 'Easy' ? 'easy' :
                                  question.difficulty === 'Medium' ? 'medium' : 'hard'
                                }
                                size="sm"
                              >
                                {question.difficulty}
                              </Badge>
                              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                                [{question.marks} marks]
                              </span>
                            </div>
                          </div>

                          {/* MCQ Options */}
                          {question.options && question.options.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Answer lines for written answers */}
                          {(question.type === 'Short Answer' || question.type === 'Long Answer') && (
                            <div className="mt-3 space-y-3">
                              {Array.from({ length: question.type === 'Long Answer' ? 4 : 2 }).map((_, i) => (
                                <div key={i} className="border-b border-dashed border-gray-200 dark:border-gray-700 h-6" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* End marker */}
          <div className="text-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-400">— End of Question Paper —</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
