import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("kanban_user") || "null"),
  login: (email) => {
    const fakeUser: User = {
      id: "u1",
      name: email.split("@")[0],
      email: email,
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    };
    localStorage.setItem("kanban_user", JSON.stringify(fakeUser));
    set({ user: fakeUser });
  },
  logout: () => {
    localStorage.removeItem("kanban_user");
    set({ user: null });
  },
}));
