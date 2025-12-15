"use client";

import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

interface SiteSettings {
  site_name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  vk_url?: string;
  telegram_url?: string;
  instagram_url?: string;
}

export default function Header() {


  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "ADRENALINE FITNESS",
    description: "Ваш лучший фитнес-зал с незабываемыми ощущениями",
    email: "ADRENALINE.FITNESS@host.fun",
    phone: "+7 (903)338-41-41",
    address: "Двинская, 11, Волгоград",
    vk_url: "",
    telegram_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    api
      .get("/site-settings")
      .then((res) => {
        if (res.data) setSettings(res.data);
      })
      .catch(() => {
        // Если API недоступно — используем fallback
      });
  }, []);

  const currentYear = new Date().getFullYear();

  const { token } = useAuthStore();

  return (
    <header className="w-full bg-black/90 text-white border-b border-white/10">
      {/* Верхняя панель */}
      <div className="w-full px-4 sm:px-6 py-2 text-[12px] sm:text-[13px] opacity-90">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          
          {/* Контакты */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>с 9:00 до 18:00</span>
            <span className="hidden sm:inline">•</span>
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-[#1E79AD] transition">
                  {settings.phone}
                </a>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">
              {settings.address}
            </span>
          </div>

          {/* Кнопка */}
          {!token ? (
            <Link
              href="/login"
              className="
                self-start sm:self-auto
                px-3 sm:px-4
                py-1.5
                bg-[#2b2b2b]
                hover:bg-[#145073]
                transition
                rounded-lg
                text-xs sm:text-sm
              "
            >
              Войти
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="
                self-start sm:self-auto
                px-3 sm:px-4
                py-1.5
                bg-[#1E79AD]
                hover:bg-[#145073]
                transition
                rounded-lg
                text-xs sm:text-sm
              "
            >
              Кабинет
            </Link>
          )}
        </div>
      </div>

      {/* Логотип и навигация */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-8 py-2 sm:py-3">
        <Link href="/" className="flex flex-col items-center leading-tight">
          <span className="text-lg sm:text-xl tracking-wide font-bold">
            ADRENALINE
          </span>
          <span className="text-[9px] sm:text-[10px] font-light opacity-80 -mt-1">
            FITNESS
          </span>
        </Link>

        {/* Навигационное меню */}
        <nav className="flex items-center justify-center gap-4 sm:gap-6 mt-2 sm:mt-0">
          <Link
            href="/trainers"
            className="text-sm text-white/80 hover:text-[#1E79AD] transition font-medium"
          >
            Тренеры
          </Link>
          <Link
            href="/schedule"
            className="text-sm text-white/80 hover:text-[#1E79AD] transition font-medium"
          >
            Расписание
          </Link>
        </nav>
      </div>
    </header>
  );
}
