"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Интерфейс для данных о записи
interface Booking {
    id: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    note: string | null;
    trainer_comment: string | null;
    form?: { // Групповое занятие
        starts_at: string;
        service: { title: string };
        trainer: { name: string };
    };
    trainer?: { // Персональная тренировка
        name: string;
    };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed": return "bg-green-100 text-green-800 border-green-200";
    case "cancelled": return "bg-red-100 text-red-800 border-red-200";
    case "pending":   return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:          return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function BookingsSection() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Мои записи</h2>
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Мои записи</h2>
      {bookings.length === 0 ? (
        <div className="text-gray-500 py-6 border-l-4 border-gray-200 bg-gray-50 p-4 rounded-xl">
            У вас нет активных записей.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const isGroupClass = !!b.form;
            const title = isGroupClass ? b.form?.service.title : (b.trainer ? `Персональная тренировка с ${b.trainer.name}` : "Персональная тренировка");
            const trainerName = b.trainer?.name || b.form?.trainer?.name || "Не указан";
            const dateTime = isGroupClass 
              ? format(new Date(b.form!.starts_at), "d MMMM yyyy, HH:mm", { locale: ru })
              : `Запрос от ${format(new Date(b.created_at), "d MMMM yyyy", { locale: ru })}`;

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {title}
                </h3>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Тип:</span>{" "}
                    {isGroupClass ? "Групповое занятие" : "Персональный запрос"}
                  </p>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Дата/Время:</span>{" "}
                    {dateTime}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-medium">Тренер:</span>{" "}
                    {trainerName}
                  </p>
                  
                  {b.note && (
                    <p className="text-gray-600 italic border-t border-gray-100 pt-2">
                        <span className="font-medium">Примечание:</span>{" "}
                        {b.note}
                    </p>
                  )}

                  {b.trainer_comment && (
                    <p className="text-blue-600 italic border-t border-gray-100 pt-2">
                        <span className="font-medium">Ответ тренера:</span>{" "}
                        {b.trainer_comment}
                    </p>
                  )}

                  <div className="pt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(b.status)}`}>
                      {b.status === "confirmed" ? "Подтверждено" :
                       b.status === "pending" ? "Ожидает" :
                       b.status === "cancelled" ? "Отменено" : b.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}