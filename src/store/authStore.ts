"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  avatar?: string | null;
  avatar_url?: string | null;
  bio?: string;
  accepts_personal_bookings?: boolean;
  metadata?: {
    age?: number;
    fitness_level?: string;
    goal?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  hasRole: (role: number) => boolean;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await api.post("/login", { email, password });
        const { token, user } = res.data;

        api.defaults.headers.Authorization = `Bearer ${token}`;
        set({ token, user });

        toast.success("Вход выполнен");
      },

      register: async (data) => {
        const res = await api.post("/register", data);
        const { token, user } = res.data;

        api.defaults.headers.Authorization = `Bearer ${token}`;
        set({ token, user });

        toast.success("Регистрация успешна");
      },

      logout: async () => {
        try {
          await api.post("/logout");
        } catch {}

        set({ token: null, user: null });
        delete api.defaults.headers.Authorization;
        localStorage.removeItem("auth-storage");

        toast.success("Вы вышли");
      },

      loadUser: async () => {
        try {
          const res = await api.get("/me");
          set({ user: res.data });
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Просто очищаем состояние, НО НЕ ВЫЗЫВАЕМ logout()
            set({ token: null, user: null });
            delete api.defaults.headers.Authorization;
            localStorage.removeItem("auth-storage");
            // Можно показать тост
            toast.error("Сессия истекла");
          }
        }
      },

      initializeAuth: async () => {
        const { token } = get();
        if (token && typeof window !== 'undefined') {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          await get().loadUser();
        }
      },

      hasRole: (role) => get().user?.role_id === role,
    }),
    {
      name: "auth-storage",

      // сохраняем и юзера, и токен
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

// Автоматическая инициализация при загрузке
if (typeof window !== 'undefined') {
  const { token, initializeAuth } = useAuthStore.getState();
  
  if (token && !window.location.pathname.includes('/login')) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    // Асинхронно загружаем пользователя
    initializeAuth();
  }
}
