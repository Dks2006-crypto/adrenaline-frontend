'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push('/');
  };

  // Определяем, админ ли пользователь
  const isAdmin = user?.role_id === 1;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          Adrenaline
        </Link>

        {/* Навигация */}
        <nav className="flex items-center gap-6">
          {token ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Личный кабинет
              </Link>

              {/* Кнопка для тренера */}
              {user?.role_id === 2 && (
                <Link href="/trainer" className="text-gray-700 hover:text-blue-600 font-medium">
                  Тренер
                </Link>
              )}

              {/* Кнопка для админа */}
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

              {/* Приветствие */}
              <span className="text-gray-600 text-sm">Привет, {user?.name}!</span>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Выйти
              </button>
            </>
          ) : (
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
          )}
        </nav>
      </div>
    </header>
  );
}