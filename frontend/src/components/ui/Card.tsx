'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, gradient = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/50 shadow-sm',
        'transition-all duration-300',
        hover && 'hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 dark:hover:border-gray-600 cursor-pointer',
        gradient && 'bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 pt-6 pb-2', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  );
}
