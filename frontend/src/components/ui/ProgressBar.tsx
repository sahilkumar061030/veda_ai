'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ progress, className, showLabel = false, size = 'md' }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={cn('w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden', heights[size])}>
        <div
          className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
