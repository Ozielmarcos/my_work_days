import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Note: No localStorage persistence here as per requirements "NÃO usar localStorage"
// However, for UX in a real app, session storage or a secure cookie might be used.
// Here we keep it in memory (state).

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => {
    set({ user });
  },
  logout: () => {
    set({ user: null });
  },
}));
