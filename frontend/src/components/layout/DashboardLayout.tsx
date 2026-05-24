'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/store/uiStore';
import { useSocket } from '@/hooks/useSocket';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  // Initialize socket connection for real-time updates
  useSocket();

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950">
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
