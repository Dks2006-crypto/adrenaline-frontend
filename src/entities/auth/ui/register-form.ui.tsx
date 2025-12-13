"use client";

import { useRegister } from "../hooks/useRegister";
import Link from "next/link";

export function RegisterForm() {
  const { form, onSubmit, isLoading } = useRegister();
  const { register, formState: { errors } } = form;

  return (
    <div className="relative w-full max-w-md">
      {/* Неоновая тень сверху и снизу */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1E79AD] to-transparent opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1E79AD] to-transparent opacity-70" />

      <form
        onSubmit={onSubmit}
        className="
          relative
          bg-[#121212]/95
          backdrop-blur-xl
          rounded-3xl
          p-8
          border
          border-[#1E79AD]/30
          shadow-2xl
          shadow-[#1E79AD]/20
        "
      >
        <h1 className="text-3xl font-bold text-white text-center mb-10">
          Регистрация
        </h1>

        {/* Имя */}
        <div className="mb-6">
          <input
            {...register("name")}
            type="text"
            placeholder="Имя"
            className="
              w-full
              px-5 py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
            "
          />
          {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-6">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="
              w-full
              px-5 py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
            "
          />
          {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
        </div>

        {/* Телефон */}
        <div className="mb-6">
          <input
            {...register("phone")}
            type="tel"
            placeholder="Телефон"
            className="
              w-full
              px-5 py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
            "
          />
          {errors.phone && <p className="text-red-400 text-sm mt-2">{errors.phone.message}</p>}
        </div>

        {/* Пароль */}
        <div className="mb-6">
          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className="
              w-full
              px-5 py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
            "
          />
          {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>}
        </div>

        {/* Подтверждение пароля */}
        <div className="mb-8">
          <input
            {...register("password_confirmation")}
            type="password"
            placeholder="Подтверждение пароля"
            className="
              w-full
              px-5 py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
            "
          />
          {errors.password_confirmation && (
            <p className="text-red-400 text-sm mt-2">{errors.password_confirmation.message}</p>
          )}
        </div>

        {/* Кнопка */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full
            py-4
            bg-[#1E79AD]
            hover:bg-[#14506d]
            text-white
            font-bold
            rounded-2xl
            shadow-lg
            shadow-[#1E79AD]/40
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        {/* Ссылка на вход */}
        <p className="mt-6 text-center text-white/70 text-sm">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-[#1E79AD] hover:text-[#1E79AD]/80 font-medium transition">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}