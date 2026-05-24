'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'rect';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded-md',
    card: 'h-48 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
    rect: 'h-24 w-full rounded-xl',
  };

  return (
    <div className={cn('shimmer', variants[variant], className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
}
