'use client';

import { useLogin } from "../hooks/useLogin";
import Link from "next/link";

export default function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();
  const { register, formState: { errors } } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Вход
        </h1>

        <div className="mb-4">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium text-lg shadow-md hover:bg-indigo-700 disabled:opacity-70 transition"
        >
          {isLoading ? "Входим..." : "Войти"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Регистрация
          </Link>
        </p>
      </form>
    </div>
  );
}