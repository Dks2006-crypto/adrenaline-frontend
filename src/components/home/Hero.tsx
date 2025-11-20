"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Hero() {
  const { user, token } = useAuthStore();
  const isAdmin = user?.role_id === 1;
  const isTrainer = user?.role_id === 2;

  return (
    <section className="container mx-auto px-6 text-center py-24">
      <h1 className="text-6xl md:text-7xl font-extrabold text-blue-700 mb-8 drop-shadow-sm">
        Adrenaline Fitness
      </h1>
      <p className="text-2xl text-gray-700 mb-14 max-w-3xl mx-auto leading-relaxed">
        Твой путь к идеальной форме начинается здесь. Профессиональное оборудование,
        лучшие тренеры и атмосфера успеха.
      </p>

      {!token ? (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700 transition shadow-xl">
            Начать бесплатно
          </Link>
          <Link href="/login" className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-50 transition shadow-xl">
            Войти
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-lg mt-6">
          <Link href="/dashboard" className="text-blue-700 hover:text-blue-800 font-semibold border-b-2 border-transparent hover:border-blue-700 transition">
            Личный кабинет
          </Link>

          {isTrainer && (
            <Link href="/trainer" className="text-blue-700 hover:text-blue-800 font-semibold border-b-2 border-transparent hover:border-blue-700 transition">
              Кабинет тренера
            </Link>
          )}

          {isAdmin && (
            <a href="http://127.0.0.1:8000/admin" target="_blank" className="text-purple-700 hover:text-purple-800 font-semibold">
              Админ-панель
            </a>
          )}
        </div>
      )}
    </section>
  );
}