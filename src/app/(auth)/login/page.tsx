'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Вход
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium text-lg shadow-md hover:bg-indigo-700 transition"
        >
          Войти
        </button>

        <p className="mt-4 text-center text-gray-600">
          Нет аккаунта?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Регистрация
          </a>
        </p>
      </form>
    </div>
  );
}
