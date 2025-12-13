"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { GroupClass } from "@/features/group-classes/model/types";
import { use } from "react";

export default function GroupClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsSync = use(params);
  const [groupClass, setGroupClass] = useState<GroupClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchGroupClass = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/api/group-classes/${paramsSync.id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Не удалось загрузить занятие");
        }

        const data = await response.json();
        setGroupClass(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupClass();
  }, [paramsSync.id]);

  const handleBooking = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setBookingStatus("loading");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ class_id: groupClass?.id }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Не удалось забронировать");
      }

      router.refresh();
      setBookingStatus("success");
      alert("Вы успешно записаны на занятие!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setBookingStatus("error");
      alert(err instanceof Error ? err.message : "Ошибка бронирования");
    }
  };

  /* V-декорация — такая же, как в списке занятий */
  const VDecor = () => (
    <div className="flex justify-center items-center mb-8 w-32 h-32 relative mx-auto">
      <svg className="absolute w-52 h-52 opacity-45" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M 22 78 L 50 28 L 78 78" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg className="absolute w-52 h-52" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M 20 22 L 50 80 L 80 22" fill="none" stroke="#1E79AD" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-12 animate-pulse">
            <div className="h-32 bg-white/5 rounded-full mb-8 mx-auto"></div>
            <div className="h-10 bg-white/10 rounded w-3/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              <div className="h-5 bg-white/10 rounded"></div>
              <div className="h-5 bg-white/10 rounded w-5/6"></div>
              <div className="h-24 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !groupClass) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {error ? "Ошибка загрузки" : "Занятие не найдено"}
            </h2>
            <p className="text-white/70 mb-8">{error || "Запрошенное занятие не существует."}</p>
            <Link
              href="/group-classes"
              className="inline-block bg-[#1E79AD] hover:bg-[#145073] text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Вернуться к занятиям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(groupClass.starts_at);
  const endDate = new Date(groupClass.ends_at);
  const timeStart = startDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const timeEnd = endDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[#0b0b0b] py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Навигация назад */}
        <Link
          href="/group-classes"
          className="inline-flex items-center gap-2 text-[#1E79AD] hover:text-[#1E79AD]/80 mb-10 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку занятий
        </Link>

        {/* Основная карточка */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-10 hover:border-[#1E79AD] transition-all duration-300">
          {/* Декор V */}
          <VDecor />

          {/* Название и программа */}
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            {groupClass.title}
          </h1>

          {groupClass.service && (
            <div className="text-center mb-10">
              <span className="inline-block bg-[#1E79AD] text-white px-6 py-2 rounded-full text-sm font-semibold">
                {groupClass.service.title}
              </span>
            </div>
          )}

          {/* Описание */}
          {groupClass.description && (
            <div className="text-center mb-12">
              <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
                {groupClass.description}
              </p>
            </div>
          )}

          {/* Ключевые характеристики */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-white/80">
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-white/60">Дата и время начала:</span>
                <span className="font-medium text-right">
                  {startDate.toLocaleDateString("ru-RU")} в {timeStart}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Окончание:</span>
                <span className="font-medium">{timeEnd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Вместимость:</span>
                <span className="font-medium">{groupClass.capacity} человек</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-white/60">Свободно мест:</span>
                <span className={`font-bold text-xl ${groupClass.available_slots <= 3 ? "text-red-400" : "text-green-400"}`}>
                  {groupClass.available_slots}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Стоимость:</span>
                <span className="font-bold text-2xl text-[#1E79AD]">
                  {(groupClass.price_cents / 100).toLocaleString("ru-RU")} ₽
                </span>
              </div>
              {groupClass.trainer && (
                <div className="flex justify-between">
                  <span className="text-white/60">Тренер:</span>
                  <span className="font-medium text-right">
                    {groupClass.trainer.name} {groupClass.trainer.last_name || ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Кнопка бронирования */}
          <div className="max-w-md mx-auto">
            <button
              onClick={handleBooking}
              disabled={bookingStatus === "loading" || groupClass.available_slots <= 0 || !token}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                groupClass.available_slots <= 0
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : !token
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : bookingStatus === "success"
                  ? "bg-green-600 text-white"
                  : "bg-[#1E79AD] hover:bg-[#145073] text-white"
              }`}
            >
              {bookingStatus === "loading"
                ? "Обработка..."
                : groupClass.available_slots <= 0
                ? "Нет свободных мест"
                : !token
                ? "Войти для записи"
                : bookingStatus === "success"
                ? "Вы записаны!"
                : "Записаться на занятие"}
            </button>

            {bookingStatus === "error" && (
              <p className="text-red-400 text-center mt-4">Не удалось записаться. Попробуйте позже.</p>
            )}
          </div>
        </div>

        {/* Дополнительно: тренер и описание сервиса (опционально) */}
        {(groupClass.trainer || groupClass.service?.description) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {groupClass.trainer && (
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Тренер</h3>
                <div className="flex items-start gap-6">
                  {groupClass.trainer.avatar_url ? (
                    <img
                      src={groupClass.trainer.avatar_url}
                      alt={`${groupClass.trainer.name} ${groupClass.trainer.last_name}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-500">?</span>
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-semibold text-white">
                      {groupClass.trainer.name} {groupClass.trainer.last_name}
                    </p>
                    {groupClass.trainer.bio && (
                      <p className="text-white/70 mt-3">{groupClass.trainer.bio}</p>
                    )}
                    {groupClass.trainer.specialties && (
                      <p className="text-[#1E79AD] mt-3 text-sm">
                        Специализация: {groupClass.trainer.specialties}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {groupClass.service?.description && (
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">О программе</h3>
                <p className="text-white/80 leading-relaxed">
                  {groupClass.service.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Нижняя кнопка */}
        <div className="mt-16 text-center">
          <Link
            href="/group-classes"
            className="inline-block bg-[#1E79AD]/20 hover:bg-[#1E79AD]/30 text-[#1E79AD] px-10 py-4 rounded-xl font-semibold transition"
          >
            Все групповые занятия
          </Link>
        </div>
      </div>
    </div>
  );
}