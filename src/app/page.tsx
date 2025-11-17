"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function HomePage() {
  const { user, token } = useAuthStore();

  const isAdmin = user?.role_id === 1;
  const isTrainer = user?.role_id === 2;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 py-24 min-h-screen">
      <section className="container mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-blue-700 mb-8 drop-shadow-sm">
          Adrenaline Fitness
        </h1>
        <p className="text-2xl text-gray-700 mb-14 max-w-3xl mx-auto leading-relaxed">
          Добро пожаловать в современный фитнес-клуб с тренерами, групповыми и персональными занятиями.
        </p>

        {/* Кнопки видны только если пользователь НЕ авторизован */}
        {!token && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700 transition shadow-xl">
              Зарегистрироваться
            </Link>
            <Link href="/login" className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-50 transition shadow-xl">
              Войти
            </Link>
          </div>
        )}

        {/* Если пользователь вошёл, показываем кнопки навигации */}
        {token && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-lg mt-6">
            <Link href="/dashboard" className="text-blue-700 hover:text-blue-800 font-semibold">
              Личный кабинет
            </Link>

            {isTrainer && (
              <Link href="/trainer" className="text-blue-700 hover:text-blue-800 font-semibold">
                Кабинет тренера
              </Link>
            )}

            {isAdmin && (
              <a
                href="http://127.0.0.1:8000/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 hover:text-purple-800 font-semibold"
              >
                Админ-панель
              </a>
            )}

            <span className="text-gray-700">Привет, {user?.name}!</span>
          </div>
        )}
      </section>

      {/* Преимущества */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-10 rounded-3xl shadow-lg text-center hover:shadow-2xl transition">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-blue-700">
              🏋️
            </div>
            <h3 className="text-2xl text-gray-800 font-bold mb-3">Профессиональные тренеры</h3>
            <p className="text-gray-600 text-lg">Индивидуальный подход для достижения результата.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg text-center hover:shadow-2xl transition">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-green-700">
              📅
            </div>
            <h3 className="text-2xl text-gray-800 font-bold mb-3">Гибкое расписание</h3>
            <p className="text-gray-600 text-lg">Групповые и персональные тренировки под ваш режим.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg text-center hover:shadow-2xl transition">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-purple-700">
              💳
            </div>
            <h3 className="text-2xl text-gray-800 font-bold mb-3">Доступные тарифы</h3>
            <p className="text-gray-600 text-lg">Выбирайте удобный тариф — от разовых посещений до абонементов.</p>
          </div>
        </div>
      </section>
    </div>
  );
}