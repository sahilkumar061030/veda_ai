'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-white dark:bg-gray-800/80 border rounded-xl text-gray-900 dark:text-gray-100 text-sm appearance-none',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
              'hover:border-gray-400 dark:hover:border-gray-500',
              error
                ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700',
              className
            )}
            {...props}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-500 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
