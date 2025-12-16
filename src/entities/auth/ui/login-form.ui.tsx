"use client";

import { useLogin } from "../hooks/useLogin";
import Link from "next/link";

export function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();
  const { register, formState: { errors } } = form;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1E79AD] to-transparent opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1E79AD] to-transparent opacity-70" />

      <form
        onSubmit={onSubmit}
        className="
          relative
          bg-[#121212]/95
          backdrop-blur-xl
          rounded-3xl
          p-6 sm:p-8
          border
          border-[#1E79AD]/30
          shadow-2xl
          shadow-[#1E79AD]/20
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-10">
          Вход
        </h1>

        <div className="mb-5 sm:mb-6">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="
              w-full
              px-4 sm:px-5
              py-3 sm:py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
              text-sm sm:text-base
            "
          />
          {errors.email && <p className="text-red-400 text-xs sm:text-sm mt-2">{errors.email.message}</p>}
        </div>

        <div className="mb-6 sm:mb-8">
          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className="
              w-full
              px-4 sm:px-5
              py-3 sm:py-4
              bg-[#1a1a1a]
              border border-white/10
              rounded-2xl
              text-white
              placeholder-white/40
              focus:border-[#1E79AD]
              focus:outline-none
              focus:ring-2 focus:ring-[#1E79AD]/30
              transition
              text-sm sm:text-base
            "
          />
          {errors.password && <p className="text-red-400 text-xs sm:text-sm mt-2">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full
            py-3 sm:py-4
            bg-[#1E79AD]
            hover:bg-[#145073]
            text-white
            font-bold
            rounded-2xl
            shadow-lg
            shadow-[#1E79AD]/40
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            min-h-[44px] flex items-center justify-center
            text-sm sm:text-base
          "
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <p className="mt-5 sm:mt-6 text-center text-white/70 text-xs sm:text-sm">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-[#1E79AD] hover:text-[#1E79AD]/80 font-medium transition">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}