'use client';

import { useRegister } from "../hooks/useRegister";
import Link from "next/link";

export default function RegisterForm() {
  const { form, onSubmit, isLoading } = useRegister();
  const { register, formState: { errors } } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Регистрация
        </h1>

        <div className="mb-4">
          <input
            {...register("name")}
            type="text"
            placeholder="Ваше имя"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition text-black"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition text-black"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition text-black"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <input
            {...register("password_confirmation")}
            type="password"
            placeholder="Повторите пароль"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition text-black"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-medium text-lg shadow-md hover:bg-purple-700 disabled:opacity-70 transition"
        >
          {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-purple-600 hover:text-purple-800 font-medium">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}