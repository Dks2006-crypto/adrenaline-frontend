import Link from "next/link";
import AuthForm from "./AuthForm";

export default function Header() {
  return (
    <header className="bg-[#1d1d1d] text-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Лого */}
        <Link href="/" className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-wide mt-1.5">ADRENALINE</span>
          <span className="text-[10px] font-light ">FITNESS</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/trainer" className="hover:text-pink-400 transition">
            Тренеры
          </Link>
          <Link href="/services" className="hover:text-pink-400 transition">
            Услуги
          </Link>
          <Link href="/pricing" className="hover:text-pink-400 transition">
            Тарифы
          </Link>
          <Link href="/gallery" className="hover:text-pink-400 transition">
            Галерея
          </Link>
          <Link href="/faq" className="hover:text-pink-400 transition">
            Часто задаваемые вопросы
          </Link>
          <Link href="/contacts" className="hover:text-pink-400 transition">
            Контакты
          </Link>
        </nav>

        {/* AuthForm с ролью */}
        <AuthForm />
      </div>
    </header>
  );
}
