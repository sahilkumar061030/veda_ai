import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'processing':
      return 'text-amber-500 bg-amber-500/10';
    case 'pending':
      return 'text-blue-500 bg-blue-500/10';
    case 'failed':
      return 'text-red-500 bg-red-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':
      return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    case 'Medium':
      return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'Hard':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}
