'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'peer w-full px-4 py-3 bg-white dark:bg-gray-800/80 border rounded-xl text-gray-900 dark:text-gray-100 text-sm transition-all duration-200',
              'placeholder-transparent',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
              'hover:border-gray-400 dark:hover:border-gray-500',
              error
                ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700',
              icon && 'pl-10',
              className
            )}
            placeholder={label}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          <label
            className={cn(
              'absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400',
              icon && 'left-10',
              (focused || hasValue || props.defaultValue)
                ? '-top-2.5 text-xs bg-white dark:bg-gray-800 px-1 font-medium'
                : 'top-3 text-sm',
              focused && !error && 'text-indigo-500',
              error && (focused || hasValue) && 'text-red-500'
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-500 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
