"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGroupClass } from "@/features/group-classes/lib/hooks/useGroupClass";
import { useAuthStore } from "@/store/authStore";
import BookingModal from "@/shared/ui/BookingModal";
import toast from "react-hot-toast";

export default function GroupClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { groupClass, loading } = useGroupClass(params.id as string);
  const { token } = useAuthStore();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const handleBooking = () => {
    if (!token) {
      toast.error("Для записи на занятие необходимо авторизоваться");
      router.push("/login");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingSuccess(true);
    setTimeout(() => setIsBookingSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!groupClass) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-8">Групповое занятие не найдено</div>
        <Link
          href="/"
          className="bg-[#1E79AD] hover:bg-[#145073] text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          На главную
        </Link>
      </div>
    );
  }

  const date = new Date(groupClass.starts_at);
  const timeStart = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEnd = new Date(groupClass.ends_at).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPastClass = new Date(groupClass.starts_at) < new Date();

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/#group-classes"
          className="inline-flex items-center text-[#1E79AD] hover:text-white transition mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          К групповым занятиям
        </Link>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
          {/* Заголовок */}
          <div className="p-8 border-b border-white/10">
            <h1 className="text-4xl font-bold text-white mb-4">{groupClass.title}</h1>
            
            {/* Статус записи */}
            {isBookingSuccess && (
              <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded-xl text-green-300">
                ✓ Вы успешно записаны на групповое занятие!
              </div>
            )}

            {/* Цена убрана по запросу пользователя */}

            {/* Основная информация */}
            <div className="grid md:grid-cols-2 gap-6 text-white/80">
              <div className="space-y-4">
                <div>
                  <span className="text-white/60">Дата и время:</span>
                  <div className="font-medium">
                    {date.toLocaleDateString("ru-RU")} в {timeStart}
                  </div>
                </div>
                
                <div>
                  <span className="text-white/60">Продолжительность:</span>
                  <div className="font-medium">{timeStart} – {timeEnd}</div>
                </div>

                <div>
                  <span className="text-white/60">Вместимость:</span>
                  <div className="font-medium">{groupClass.capacity} человек</div>
                </div>

                <div>
                  <span className="text-white/60">Свободно мест:</span>
                  <div className={`font-bold ${groupClass.available_slots <= 3 ? "text-red-400" : "text-green-400"}`}>
                    {groupClass.available_slots}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {groupClass.service && (
                  <div>
                    <span className="text-white/60">Программа:</span>
                    <div className="font-medium">{groupClass.service.title}</div>
                  </div>
                )}

                {groupClass.trainer && (
                  <div>
                    <span className="text-white/60">Тренер:</span>
                    <div className="flex items-center space-x-3">
                      {groupClass.trainer.avatar_url ? (
                        <img
                          src={groupClass.trainer.avatar_url}
                          alt={`${groupClass.trainer.name} ${groupClass.trainer.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#1E79AD] rounded-full flex items-center justify-center text-white font-bold">
                          {groupClass.trainer.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {groupClass.trainer.name} {groupClass.trainer.last_name}
                        </div>
                        {groupClass.trainer.specialties && (
                          <div className="text-sm text-white/60">
                            {groupClass.trainer.specialties}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Описание */}
          {groupClass.description && (
            <div className="p-8 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Описание</h2>
              <p className="text-white/80 leading-relaxed">{groupClass.description}</p>
            </div>
          )}

          {/* Био тренера */}
          {groupClass.trainer?.bio && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">О тренере</h2>
              <p className="text-white/80 leading-relaxed">{groupClass.trainer.bio}</p>
            </div>
          )}
        </div>

        {/* Кнопка записи */}
        <div className="mt-8 flex justify-center">
          {isPastClass ? (
            <button
              disabled
              className="bg-gray-700 text-gray-500 px-8 py-4 rounded-xl font-semibold cursor-not-allowed"
            >
              Занятие завершено
            </button>
          ) : groupClass.available_slots > 0 ? (
            <button
              onClick={handleBooking}
              className="bg-[#1E79AD] hover:bg-[#145073] text-white px-8 py-4 rounded-xl font-semibold transition text-lg"
            >
              Записаться на занятие
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-700 text-gray-500 px-8 py-4 rounded-xl font-semibold cursor-not-allowed"
            >
              Нет свободных мест
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно записи */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
        trainerId={null}
        classId={groupClass.id}
      />
    </div>
  );
}