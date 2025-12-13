"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
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
            <span>+7 (903) 333-41-41</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">
              Двинская, 11 Волгоград
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

      {/* Логотип */}
      <div className="flex items-center justify-center py-2 sm:py-3">
        <Link href="/" className="flex flex-col items-center leading-tight">
          <span className="text-lg sm:text-xl tracking-wide font-bold">
            ADRENALINE
          </span>
          <span className="text-[9px] sm:text-[10px] font-light opacity-80 -mt-1">
            FITNESS
          </span>
        </Link>
      </div>
    </header>
  );
}
