"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useRouter } from "next/navigation";

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
      return { text: "Подтверждено", color: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50", glowColor: "shadow-emerald-500/20" };
    case "cancelled":
      return { text: "Отменено", color: "bg-red-500/20 text-red-300 border-red-400/50", glowColor: "shadow-red-500/20" };
    case "pending":
      return { text: "Ожидает подтверждения", color: "bg-yellow-500/20 text-yellow-300 border-yellow-400/50", glowColor: "shadow-yellow-500/20" };
    default:
      return { text: status, color: "bg-gray-500/20 text-gray-300 border-gray-400/50", glowColor: "shadow-gray-500/20" };
  };
};

export default function BookingsSection() {
  const router = useRouter();
  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  // Показываем только последние 3 записи
  const displayedBookings = bookings.slice(0, 3);

  const handleShowAllBookings = () => {
    // Переходим к секции history в dashboard
    router.push("/dashboard#history");
  };

  if (isLoading) {
    return (
      <section className="flex justify-center py-20">
        <div className="w-full max-w-4xl border-2 border-[#1E79AD] rounded-2xl p-8 text-white relative bg-black/70 backdrop-blur">
          <h2 className="text-center text-xl mb-10 opacity-90">Мои записи</h2>
          <div className="text-center py-12 text-white/70">Загрузка записей...</div>
        </div>
      </section>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="flex justify-center py-20">
        <div className="w-full max-w-4xl border-2 border-[#1E79AD] rounded-2xl p-8 text-white relative bg-black/70 backdrop-blur">
          <h2 className="text-center text-xl mb-10 opacity-90">Мои записи</h2>
          <div className="text-center py-12 bg-gradient-to-br from-[#1E79AD]/10 to-purple-600/10 border border-[#1E79AD]/30 rounded-2xl">
            <div className="text-white/90 text-lg mb-2">У вас пока нет записей</div>
            <div className="text-white/60">Запишитесь на групповое занятие или отправьте запрос тренеру!</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center py-20">
      <div className="w-full max-w-6xl border-2 border-[#1E79AD] rounded-2xl p-8 text-white relative bg-black/70 backdrop-blur">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl opacity-90">Мои записи</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => refetch()}
              className="text-[#1E79AD] hover:text-[#145073] font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m10-5v5h-5m-10 6v5h5m10-5v5h-5" />
              </svg>
              Обновить
            </button>
            {bookings.length > 3 && (
              <button
                onClick={handleShowAllBookings}
                className="bg-[#1E79AD] hover:bg-[#145073] text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Все записи ({bookings.length})
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBookings.map((booking) => {
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
                className={`bg-gradient-to-br from-black/60 to-black/40 backdrop-blur border border-[#1E79AD]/30 rounded-2xl p-6 hover:shadow-2xl hover:border-[#1E79AD]/60 transition-all duration-300 transform hover:-translate-y-1 ${status.glowColor}`}
              >
                {/* Заголовок с типом */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isGroup ? "bg-purple-500/20 text-purple-300 border border-purple-400/50" : "bg-blue-500/20 text-blue-300 border border-blue-400/50"}`}>
                    {isGroup ? "Групповое занятие" : "Персональная тренировка"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-4 leading-tight">
                  {title}
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-white/70 min-w-20">Дата:</span>
                    <span className="font-semibold text-white">{dateTime}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="font-medium text-white/70 min-w-20">Тренер:</span>
                    <span className="text-white">{trainerName}</span>
                  </div>

                  {booking.note && (
                    <div className="pt-3 border-t border-[#1E79AD]/30">
                      <p className="text-white/60 text-xs mb-1">Ваше примечание:</p>
                      <p className="italic text-white/80">{booking.note}</p>
                    </div>
                  )}

                  {booking.trainer_comment && (
                    <div className="pt-3 border-t border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 -mx-6 px-6 pb-0 rounded-b-2xl">
                      <p className="text-purple-300 text-xs font-medium mb-1">Комментарий тренера:</p>
                      <p className="text-purple-200 font-medium">{booking.trainer_comment}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Показать больше записей */}
        {bookings.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowAllBookings}
              className="inline-flex items-center gap-2 text-[#1E79AD] hover:text-white transition-colors font-medium"
            >
              Показать все записи ({bookings.length})
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}