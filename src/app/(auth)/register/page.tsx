'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Регистрация</h1>
        <input
          type="text"
          placeholder="Имя"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}