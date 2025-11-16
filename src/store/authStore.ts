'use client';

import { create } from 'zustand';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null, // ← Безопасно!

  login: async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ token, user });
      toast.success('Вход выполнен');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Ошибка входа');
      throw err;
    }
  },

  register: async (data) => {
    try {
      const res = await api.post('/register', data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ token, user });
      toast.success('Регистрация успешна');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Ошибка регистрации');
      throw err;
    }
  },

  logout: async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.success('Вы вышли');
  },

  loadUser: async () => {
    try {
      const res = await api.get('/me');
      set({ user: res.data });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  hasRole: (role) => get().user?.role_id === role,
}));