"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Обновлённый интерфейс — теперь точно соответствует тому, что возвращает бэкенд
interface Booking {
  id: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  note: string | null;
  trainer_comment: string | null;

  // Для групповых занятий (через form или group_class_id)
  form?: {
    starts_at: string;
    service: { title: string };
    trainer: { name: string; last_name: string };
  };

  // Для персональных тренировок (через trainer_id)
  trainer?: {
    name: string;
    last_name: string;
  };

  // Если используешь group_class_id — можно добавить (опционально)
  group_class?: {
    title: string;
    starts_at: string;
    trainer: { name: string; last_name: string };
  };
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return { text: "Подтверждено", color: "bg-green-100 text-green-800 border-green-300" };
    case "cancelled":
      return { text: "Отменено", color: "bg-red-100 text-red-800 border-red-300" };
    case "pending":
      return { text: "Ожидает подтверждения", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
    default:
      return { text: status, color: "bg-gray-100 text-gray-800 border-gray-300" };
  }
};

export default function BookingsSection() {
  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
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

  if (bookings.length === 0) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Мои записи</h2>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-lg">У вас пока нет записей нет</p>
          <p className="text-gray-500 mt-2">Запишитесь на групповое занятие или отправьте запрос тренеру!</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Мои записи</h2>
        <button
          onClick={() => refetch()}
          className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m10-5v5h-5m-10 6v5h5m10-5v5h-5" />
          </svg>
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => {
          const isGroup = !!booking.form || !!booking.group_class;
          const status = getStatusConfig(booking.status);

          // Определяем название занятия
          const title = isGroup
            ? booking.form?.service.title || booking.group_class?.title || "Групповое занятие"
            : `Персональная тренировка с ${booking.trainer?.name || "тренером"}`;

          // Определяем имя тренера
          const trainerName = (() => {
            if (!isGroup) {
              const t = booking.trainer;
              if (!t) return "Тренер не указан";
              return `${t.name || ""} ${t.last_name || ""}`.trim() || "Тренер не указан";
            }
          
            // Для групповых
            const trainer = booking.form?.trainer || booking.group_class?.trainer;
            if (!trainer) return "Тренер не назначен";
          
            return `${trainer.name || ""} ${trainer.last_name || ""}`.trim() || "Тренер не назначен";
          })();
          // Дата и время
          const dateTime = isGroup
            ? format(new Date(booking.form?.starts_at || booking.group_class?.starts_at || booking.created_at), "d MMMM yyyy, HH:mm", { locale: ru })
            : `Запрос от ${format(new Date(booking.created_at), "d MMMM yyyy", { locale: ru })}`;

          return (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              {/* Заголовок с типом */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isGroup ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                  {isGroup ? "Групповое занятие" : "Персональная тренировка"}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                  {status.text}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {title}
              </h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-800 min-w-24">Дата:</span>
                  <span className="font-semibold text-gray-900">{dateTime}</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-800 min-w-24">Тренер:</span>
                  <span className="text-gray-900">{trainerName}</span>
                </div>

                {booking.note && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-500 text-xs">Ваше примечание:</p>
                    <p className="italic text-gray-700">{booking.note}</p>
                  </div>
                )}

                {booking.trainer_comment && (
                  <div className="pt-3 border-t border-pink-100 bg-pink-50 -mx-6 px-6 pb-0">
                    <p className="text-pink-700 text-xs font-medium">Комментарий тренера:</p>
                    <p className="text-pink-800 font-medium">{booking.trainer_comment}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}