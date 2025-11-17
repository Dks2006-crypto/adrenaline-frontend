"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  const { data: memberships } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => api.get("/memberships").then((res) => res.data),
  });

  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Личный кабинет, {user?.name}
          </h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition"
          >
            Выйти
          </button>
        </div>

        {/* Подписки */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Подписки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberships?.map((m: any) => (
              <div
                key={m.id}
                className={`p-6 rounded-2xl shadow-md border border-gray-200 bg-white transition hover:scale-105`}
              >
                <h3 className="text-lg font-semibold mb-2">{m.service.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    m.status
                  )}`}
                >
                  {m.status}
                </span>
                <p className="mt-2 text-gray-600">
                  Осталось посещений: {m.remaining_visits}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Записи */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Записи</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings?.map((b: any) => (
              <div
                key={b.id}
                className={`p-6 rounded-2xl shadow-md border border-gray-200 bg-white transition hover:scale-105`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {b.form.service.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Профиль */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Профиль</h2>
          <div className="p-6 rounded-2xl shadow-md bg-white border border-gray-200 max-w-md flex items-center gap-4">
            {/* Аватар */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Данные пользователя */}
            <div className="text-black">
              <p className="mb-2">
                <span className="font-semibold">Имя: </span> {user?.name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email: </span> {user?.email}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Роль: </span>{" "}
                {user?.role_id === 1
                  ? "Администратор"
                  : user?.role_id === 2
                  ? "Тренер"
                  : "Клиент"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
