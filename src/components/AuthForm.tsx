// components/AuthStatus.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthForm() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  // ← САМОЕ ВАЖНОЕ: ждём, пока клиент смонтируется
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push('/');
  };

  // Пока не смонтировались — показываем НЕЧТО, что совпадает с сервером
  if (!isMounted) {
    return (
      <>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </>
    );
  }

  // Теперь рендерим настоящий контент — только на клиенте
  if (!token || !user) {
    return (
      <>
        <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
          Войти
        </Link>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Регистрация
        </Link>
      </>
    );
  }

  const isAdmin = user.role_id === 1;

  return (
    <>
      <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
        Личный кабинет
      </Link>

      {user.role_id === 2 && (
        <Link href="/trainer" className="text-gray-700 hover:text-blue-600 font-medium">
          Тренер
        </Link>
      )}

      {isAdmin && (
        <a
          href="http://127.0.0.1:8000/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm"
        >
          Админ-панель
        </a>
      )}

      <span className="text-gray-600 text-sm">Привет, {user.name}!</span>

      <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium">
        Выйти
      </button>
    </>
  );
}