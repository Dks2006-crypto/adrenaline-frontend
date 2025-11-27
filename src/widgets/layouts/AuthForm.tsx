'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthForm() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push('/');
  };

  // Пока hydrating — скелеты
  if (!isMounted) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-8 bg-gray-700/50 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-700/50 rounded animate-pulse" />
      </div>
    );
  }

  /* ===========================
      НЕ АВТОРИЗОВАН
  ============================ */
  if (!token) {
    return (
      <Link
        href="/login"
        className="
          px-6 py-2 rounded-full 
          bg-pink-500 hover:bg-pink-600 
          text-white font-medium transition
        "
      >
        Войти
      </Link>
    );
  }

  /* ===========================
      АВТОРИЗОВАН
  ============================ */
  return (
    <div className="flex items-center gap-6 text-sm">

      <Link href="/dashboard" className="hover:text-pink-400 transition">
        Личный кабинет
      </Link>

      {/* Тренер */}
      {user?.role_id === 2 && (
        <Link href="/trainer" className="hover:text-pink-400 transition">
          Тренер панель
        </Link>
      )}

      {/* Админ */}
      {user?.role_id === 1 && (
        <a
          href="http://127.0.0.1:8000/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="
            bg-purple-600 hover:bg-purple-700
            text-white px-4 py-2 rounded-lg transition
          "
        >
          Админ
        </a>
      )}

      {/* Имя */}
      <span className="text-gray-300 text-sm">
        {user?.name || 'гость'}
      </span>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-red-400 hover:text-red-500 font-medium transition"
      >
        Выйти
      </button>
    </div>
  );
}
