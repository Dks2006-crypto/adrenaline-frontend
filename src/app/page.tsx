'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { user, token, loadUser } = useAuthStore();
  const router = useRouter();

  // Загружаем пользователя при загрузке
  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  // Перенаправляем в личный кабинет
  useEffect(() => {
    if (user && token) {
      if (user.role_id === 2) {
        router.push('/trainer'); // Тренер
      } else {
        router.push('/dashboard'); // Клиент
      }
    }
  }, [user, token, router]);

  // Если авторизован — показываем лоадер
  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Adrenaline Fitness
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Современный фитнес-клуб с профессиональными тренерами, групповыми занятиями и персональными тренировками.
        </p>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Зарегистрироваться
          </Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            Войти
          </Link>
        </div>
      </section>

      {/* Преимущества */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏋️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Профессиональные тренеры</h3>
            <p className="text-gray-600">Индивидуальный подход к каждому клиенту</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗓️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Гибкое расписание</h3>
            <p className="text-gray-600">Групповые и персональные занятия</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Удобные тарифы</h3>
            <p className="text-gray-600">От разовых посещений до годовых абонементов</p>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-lg mb-8">Присоединяйтесь к нам уже сегодня!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Посмотреть тарифы
            </Link>
            <Link
              href="/schedule"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Расписание
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2025 Adrenaline Fitness. Все права защищены.</p>
      </footer>
    </div>
  );
}