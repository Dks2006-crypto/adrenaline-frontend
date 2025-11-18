"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed": return "bg-green-100 text-green-800";
    case "cancelled": return "bg-red-100 text-red-800";
    case "pending":   return "bg-yellow-100 text-yellow-800";
    default:          return "bg-gray-100 text-gray-800";
  }
};

export default function BookingsSection() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Мои записи</h2>
        <div className="text-center py-12 text-gray-500">Загрузка записей...</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Мои записи на занятия</h2>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-200">
          <p className="text-xl text-gray-600">У вас пока нет записей</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b: any) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {b.form?.service?.title || "Занятие"}
              </h3>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Дата:</span>{" "}
                  {b.form?.starts_at
                    ? format(new Date(b.form.starts_at), "d MMMM yyyy, HH:mm", { locale: ru })
                    : "—"}
                </p>

                <p className="text-gray-600">
                  <span className="font-medium">Тренер:</span>{" "}
                  {b.trainer?.name || b.form?.trainer?.name || "Не указан"}
                </p>

                <div className="pt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>
                    {b.status === "confirmed" ? "Подтверждено" :
                     b.status === "cancelled" ? "Отменено" :
                     b.status === "pending" ? "Ожидает" : b.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}