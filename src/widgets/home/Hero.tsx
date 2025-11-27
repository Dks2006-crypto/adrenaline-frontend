"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

interface HeroData {
  title: string;
  description: string;
  image_url?: string;
  extra_data?: {
    background_overlay?: string;
    text_color?: string;
  };
}

export default function Hero() {
  const { user, token } = useAuthStore();
  const isAdmin = user?.role_id === 1;
  const isTrainer = user?.role_id === 2;

  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${apiUrl}/api/hero`);
        const result = await response.json();

        if (result.success) {
          setHeroData(result.data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-[650px] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </section>
    );
  }

  return (
    <section
      className="
        relative w-full h-[650px] bg-cover bg-center bg-no-repeat
      "
      style={{
        backgroundImage: heroData?.image_url
          ? `url('${heroData.image_url}')`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" // fallback градиент
      }}
    >
      {/* Тёмный оверлей */}
      <div
        className="absolute inset-0"
        style={{
          background: heroData?.extra_data?.background_overlay || 'rgba(0,0,0,0.5)'
        }}
      />

      {/* Контент внутри */}
      <div className="relative max-w-5xl mx-auto px-6 pt-6 pb-20">
        <div className="bg-black/40 backdrop-blur-sm p-10 rounded-2xl shadow-xl"
             style={{ color: heroData?.extra_data?.text_color || '#ffffff' }}>

          <h2 className="text-2xl md:text-3xl font-semibold mb-6 leading-snug">
            {heroData?.title || "Почему выбирают именно нас? Потому что мы создали фитнес без отговорок."}
          </h2>

          <div className="text-[17px] leading-relaxed opacity-90 whitespace-pre-line">
            {heroData?.description || `• Команда, которая вдохновляет: Наши тренеры — не просто инструкторы, а ваши персональные мотиваторы. Они найдут подход к каждому и добьются результата вместе с вами.

• Атмосфера, в которую хочется возвращаться: Чистота, современное оборудование и дружелюбные сотрудники. Здесь вас поддержат и всегда рады видеть.

• Результат, который вы полюбите: Мы помогаем не просто похудеть или накачаться, а полюбить своё тело и ощутить радость от движения.`}
          </div>

          <p className="mt-8 text-lg opacity-90">
            Приходите в{" "}
            <Link href="/" className="text-blue-400 hover:text-blue-300 underline transition">
              Adrenaline Fitness
            </Link>
            . Начните меняться к лучшему с удовольствием.
          </p>

          {/* Кнопки под текстом (только если не авторизован) */}
          {!token ? (
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href="/register"
                className="bg-pink-500 hover:bg-pink-600 transition text-white px-8 py-3 rounded-xl font-semibold"
              >
                Присоединиться
              </Link>

              <Link
                href="/login"
                className="bg-white/20 border border-white/40 hover:bg-white/30 transition text-white px-8 py-3 rounded-xl font-semibold backdrop-blur-sm"
              >
                Войти
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 items-center text-lg mt-8 opacity-90">

              <Link
                href="/dashboard"
                className="text-blue-300 hover:text-blue-200 underline transition"
              >
                Личный кабинет
              </Link>

              {isTrainer && (
                <Link
                  href="/trainer"
                  className="text-blue-300 hover:text-blue-200 underline transition"
                >
                  Кабинет тренера
                </Link>
              )}

              {isAdmin && (
                <a
                  href="http://127.0.0.1:8000/admin"
                  target="_blank"
                  className="text-purple-300 hover:text-purple-200 underline transition"
                >
                  Админ-панель
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
