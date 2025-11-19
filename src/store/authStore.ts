'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  avatar?: string | null;
  avatar_url?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  hasRole: (role: number) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await api.post('/login', { email, password });
        const { token, user } = res.data;

        api.defaults.headers.Authorization = `Bearer ${token}`;
        set({ token, user });

        toast.success('Вход выполнен');
      },

      register: async (data) => {
        const res = await api.post('/register', data);
        const { token, user } = res.data;

        api.defaults.headers.Authorization = `Bearer ${token}`;
        set({ token, user });

        toast.success('Регистрация успешна');
      },

      logout: async () => {
        try {
          await api.post('/logout');
        } catch {}

        set({ token: null, user: null });
        delete api.defaults.headers.Authorization;

        toast.success('Вы вышли');
      },

      loadUser: async () => {
        try {
          const res = await api.get('/me');
          set({ user: res.data });
        } catch {
          get().logout();
        }
      },

      hasRole: (role) => get().user?.role_id === role,
    }),
    {
      name: 'auth-storage',

      // ← ФИКС: сохраняем и юзера, и токен
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

// восстановление токена и автоподгрузка
if (typeof window !== 'undefined') {
  const { token } = useAuthStore.getState();

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    useAuthStore.getState().loadUser().catch(() => {});
  }
}
