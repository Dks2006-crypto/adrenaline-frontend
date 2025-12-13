"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
// type: "single" | "monthly" | "yearly";
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
  const { token } = useAuthStore();

  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/api/hero`);
        const data = await res.json();

        if (data.success) setHeroData(data.data);
      } catch (e) {
        console.error("Ошибка загрузки Hero:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full min-h-[500px] flex items-center justify-center bg-black">
        <p className="text-white text-lg">Загрузка...</p>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[600px] md:h-[650px] lg:h-[850px]">
      {/* Фон */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: heroData?.image_url
            ? `url('${heroData.image_url}')`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            heroData?.extra_data?.background_overlay || "rgba(0,0,0,0.8)",
        }}
      />

      {/* Контент */}
      <div className="relative h-full flex items-center justify-center md:justify-end px-4 sm:px-6 md:px-14 py-10">
        <div
          className="
            w-full
            max-w-md
            bg-black/70
            backdrop-blur-md
            rounded-2xl
            shadow-xl
            px-6 py-8
            sm:px-8 sm:py-9
            md:p-10
          "
          style={{
            color: heroData?.extra_data?.text_color || "#fff",
            boxShadow: "0 0 40px rgba(30, 121, 173, 0.5)",
          }}
        >
          {/* Логотип */}
          <div className="mb-4 text-center">
            <span className="block text-[18px] sm:text-[22px] md:text-[24px] text-[#1E79AD] font-mono tracking-widest">
              ADRENALINE
            </span>
            <span className="block text-[14px] sm:text-[15px] md:text-[16px] tracking-wide">
              FITNESS
            </span>
          </div>

          {/* Заголовок */}
          <h2 className="text-[18px] sm:text-[20px] md:text-[24px] font-semibold mb-4">
            {heroData?.title}
          </h2>

          {/* Описание */}
          <p className="text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed opacity-90 mb-6 md:mb-8 whitespace-pre-line">
            {heroData?.description}
          </p>

          {/* Кнопка */}
          {!token ? (
            <Link
              href="/register"
              className="
                w-full block
                bg-[#404096]
                hover:bg-[#1c1c4f]
                transition
                text-center
                py-3
                rounded-xl
                font-semibold
                text-sm sm:text-base
              "
            >
              Регистрация / Вход
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="
                w-full block
                bg-[#404096]
                hover:bg-[#1c1c4f]
                transition
                text-center
                py-3
                rounded-xl
                font-semibold
                text-sm sm:text-base
              "
            >
              Перейти в кабинет
            </Link>
          )}

          <p className="mt-3 text-[11px] sm:text-[12px] opacity-70 text-center">
            Мы рады, что вы выбрали нас!
          </p>
        </div>
      </div>
    </section>
  );
}
