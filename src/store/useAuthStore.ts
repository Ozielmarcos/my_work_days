import { create } from 'zustand';
interface AuthState {
  token: string | null;
  refresh_token: string | null;
  setTokens: (token: string, refresh_token: string) => void
  /** Store login info (token and user) */
  logout: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  refresh_token: localStorage.getItem("refresh_token"),
  setTokens: (token, refresh_token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("refresh_token", refresh_token)
    set({ token, refresh_token })
  },
  logout: () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      set({ token: null, refresh_token: null });
    }
  },
}));

