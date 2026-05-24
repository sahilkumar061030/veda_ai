import { create } from 'zustand';
import { Assignment, AssignmentStats, PaginationInfo } from '@/types';
import { api } from '@/lib/api';

interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  stats: AssignmentStats | null;
  recentActivity: { _id: string; count: number }[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  
  fetchAssignments: (params?: { page?: number; status?: string; search?: string }) => Promise<void>;
  fetchAssignment: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  createAssignment: (formData: FormData) => Promise<Assignment>;
  regenerateAssignment: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  updateAssignmentStatus: (id: string, status: Assignment['status'], paper?: any) => void;
  clearError: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  currentAssignment: null,
  stats: null,
  recentActivity: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchAssignments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getAssignments(params);
      set({
        assignments: response.assignments,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },

  fetchAssignment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getAssignment(id);
      set({ currentAssignment: response.assignment, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },

  fetchStats: async () => {
    try {
      const response = await api.getStats();
      set({
        stats: response.stats,
        recentActivity: response.recentActivity,
      });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  },

  createAssignment: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createAssignment(formData);
      set({ isLoading: false });
      // Refresh assignments list
      get().fetchAssignments();
      return response.assignment;
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  regenerateAssignment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.regenerateAssignment(id);
      // Update local state
      set((state) => ({
        isLoading: false,
        currentAssignment: state.currentAssignment?._id === id
          ? { ...state.currentAssignment, status: 'pending', generatedPaper: undefined }
          : state.currentAssignment,
        assignments: state.assignments.map((a) =>
          a._id === id ? { ...a, status: 'pending' as const } : a
        ),
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      await api.deleteAssignment(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateAssignmentStatus: (id, status, paper) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, status, generatedPaper: paper || a.generatedPaper } : a
      ),
      currentAssignment:
        state.currentAssignment?._id === id
          ? { ...state.currentAssignment, status, generatedPaper: paper || state.currentAssignment.generatedPaper }
          : state.currentAssignment,
    }));
  },

  clearError: () => set({ error: null }),
}));
