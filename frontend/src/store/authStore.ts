import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { api } from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, institution: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.login({ email, password });
          const { token, user } = response;

          localStorage.setItem('vedaai_token', token);
          connectSocket(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, institution: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.register({ name, email, password, institution });
          const { token, user } = response;

          localStorage.setItem('vedaai_token', token);
          connectSocket(token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('vedaai_token');
        disconnectSocket();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('vedaai_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          const response = await api.getMe();
          connectSocket(token);
          set({
            user: response.user,
            token,
            isAuthenticated: true,
          });
        } catch {
          localStorage.removeItem('vedaai_token');
          set({ isAuthenticated: false, user: null, token: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'vedaai-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
