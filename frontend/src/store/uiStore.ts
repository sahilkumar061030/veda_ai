import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  generationStatus: {
    assignmentId: string | null;
    status: 'idle' | 'started' | 'progress' | 'completed' | 'failed';
    progress: number;
    message: string;
  };
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setGenerationStatus: (status: UIState['generationStatus']) => void;
  resetGenerationStatus: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      generationStatus: {
        assignmentId: null,
        status: 'idle',
        progress: 0,
        message: '',
      },

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setGenerationStatus: (status) => set({ generationStatus: status }),

      resetGenerationStatus: () =>
        set({
          generationStatus: {
            assignmentId: null,
            status: 'idle',
            progress: 0,
            message: '',
          },
        }),
    }),
    {
      name: 'vedaai-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
