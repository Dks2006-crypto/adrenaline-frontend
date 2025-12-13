"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

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

export default function Footer() {
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

  return (
    <footer className="bg-[#0b0b0b] text-white">
      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Левая колонка — логотип и описание */}
          <div>
            <h2 className="text-[#1E79AD] text-3xl font-bold mb-4">
              {settings.site_name}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {settings.description}
            </p>
          </div>

          {/* Центральная колонка — контакты */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Контакты</h3>
            <div className="space-y-4 text-white/80 text-sm">
              <p>
                Email: <a href={`mailto:${settings.email}`} className="hover:text-[#1E79AD] transition">
                  {settings.email}
                </a>
              </p>
              <p>
                Телефон: <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-[#1E79AD] transition">
                  {settings.phone}
                </a>
              </p>
              <p>
                Адрес: {settings.address}
              </p>
            </div>
          </div>

          {/* Правая колонка — соцсети */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-xl font-semibold mb-6">Следите за нами</h3>
            <div className="flex gap-6">
              {settings.vk_url && (
                <a
                  href={settings.vk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl hover:text-[#1E79AD] transition"
                  aria-label="VK"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.07 2H8.93C3.37 2 2 3.37 2 8.93v6.14C2 20.63 3.37 22 8.93 22h6.14C20.63 22 22 20.63 22 15.07V8.93C22 3.37 20.63 2 15.07 2zm3.76 14.06h-1.39c-.52 0-.67-.32-1.04-.71-.41-.43-.56-.61-.56-.61s-.75-1.99-.88-2.33c-.14-.37-.1-.64-.44-.64h-1.39c-.37 0-.54.19-.54.19s-1.67 3.78-4.03 5.55c-.45.33-.83.49-1.13.49-.15 0-.37-.02-.37-.37v-5.37s-.01-.8.36-.8c.26 0 .71.13 1.76 1.25.99 1.07 1.7 2.18 1.7 2.18s.1.26.24.26h2.78s.14-.01.08-.48c-.04-.28-.23-1.28-.23-1.28s-1.3-3.01-2.24-4.24c-.8-.99-1.14-.92-1.14-.92s-.9-.03-1 .28c0 0 .9 2.32 1.93 4.82.72 1.74 1.53 1.6 1.53 1.6z" />
                  </svg>
                </a>
              )}
              {settings.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl hover:text-[#1E79AD] transition"
                  aria-label="Telegram"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.36 7.06l-8.91 3.33c-.6.22-.6.6.1.84l2.24.7 5.2-3.25c.23-.14.44-.06.27.08l-4.2 3.94.06 2.9c.08.44.38.6.65.46l1.58-1.2 3.1 2.28c.54.3 1.02.14 1.17-.46l2.12-10.16c.22-.94-.3-1.36-.88-1.1z" />
                  </svg>
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl hover:text-[#1E79AD] transition"
                  aria-label="Instagram"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя полоса и копирайт */}
      <div className="border-t border-[#1E79AD]/50">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-white/70 text-sm">
          © {currentYear} {settings.site_name}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}