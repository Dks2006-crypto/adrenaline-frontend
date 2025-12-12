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
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchGroupClass = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(
          `${apiUrl}/api/group-classes/${paramsSync.id}`
        );

        if (!response.ok) {
          try {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Не удалось загрузить информацию о занятии"
            );
          } catch (e) {
            throw new Error("Не удалось загрузить информацию о занятии");
          }
        }

        const data = await response.json();
        setGroupClass(data);
      } catch (error) {
        console.error("Error fetching group class:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroupClass();
  }, [paramsSync.id]);

  const handleBooking = async () => {
  if (!token) {
    router.push('/login');
    return;
  }

  setBookingStatus('loading');

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const response = await fetch(`${apiUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_id: groupClass?.id,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Не удалось забронировать');
    }

    // Просто обновляем страницу — Next.js сам подтянет свежие данные
    router.refresh();

    setBookingStatus('success');
    alert('Вы успешно записаны!');

    setTimeout(() => router.push('/dashboard'), 1500);
  } catch (err) {
    setBookingStatus('error');
    alert(err instanceof Error ? err.message : 'Ошибка бронирования');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-800 rounded-xl p-8 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-6"></div>
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-red-900/50 border border-red-800 rounded-xl p-8 text-red-200 text-center">
            <h2 className="text-2xl font-bold mb-4">Ошибка загрузки</h2>
            <p>{error}</p>
            <Link
              href="/group-classes"
              className="mt-6 inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Вернуться к списку занятий
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!groupClass) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
            <h2 className="text-2xl font-bold mb-4">Занятие не найдено</h2>
            <Link
              href="/group-classes"
              className="mt-6 inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Вернуться к списку занятий
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Навигационная ссылка */}
        <div className="mb-8">
          <Link
            href="/group-classes"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Назад к списку занятий
          </Link>
        </div>

        {/* Основная информация */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">
                {groupClass.title}
              </h1>

              {groupClass.service && (
                <div className="mb-6">
                  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                    {groupClass.service.title}
                  </span>
                </div>
              )}

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 whitespace-pre-line">
                  {groupClass.description ||
                    "Подробное описание занятия будет добавлено позже."}
                </p>
              </div>
            </div>

            <div className="w-full md:w-80">
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 text-sm">Стоимость:</span>
                  <span className="text-white text-2xl font-bold">
                    {(groupClass.price_cents / 100).toLocaleString("ru-RU")}{" "}
                    {groupClass.currency}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">
                      Свободных мест:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        groupClass.available_slots <= 3
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {groupClass.available_slots} из {groupClass.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        groupClass.available_slots <= 3
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          (groupClass.available_slots / groupClass.capacity) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={
                    bookingStatus === "loading" ||
                    groupClass.available_slots <= 0 ||
                    !token
                  }
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition ${
                    groupClass.available_slots <= 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : !token
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {bookingStatus === "loading"
                    ? "Обработка..."
                    : groupClass.available_slots <= 0
                    ? "Нет свободных мест"
                    : !token
                    ? "Войти для бронирования"
                    : bookingStatus === "success"
                    ? "Забронировано!"
                    : "Забронировать место"}
                </button>

                {bookingStatus === "error" && (
                  <p className="text-red-400 text-sm mt-2 text-center">
                    Не удалось забронировать. Попробуйте позже.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Информация о времени и тренере */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Расписание
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-gray-400 text-sm">Начало</p>
                  <p className="text-white font-medium">
                    {new Date(groupClass.starts_at).toLocaleString("ru-RU", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-gray-400 text-sm">Окончание</p>
                  <p className="text-white font-medium">
                    {new Date(groupClass.ends_at).toLocaleString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-gray-400 text-sm">Продолжительность</p>
                  <p className="text-white font-medium">
                    {Math.floor(
                      (new Date(groupClass.ends_at).getTime() -
                        new Date(groupClass.starts_at).getTime()) /
                        (1000 * 60 * 60)
                    )}{" "}
                    часов
                    {Math.floor(
                      (new Date(groupClass.ends_at).getTime() -
                        new Date(groupClass.starts_at).getTime()) /
                        (1000 * 60)
                    ) % 60}{" "}
                    минут
                  </p>
                </div>
              </div>

              {groupClass.recurrence_rule && (
                <div className="flex items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-sm">Повторяется</p>
                    <p className="text-white font-medium">
                      {groupClass.recurrence_rule.includes("WEEKLY")
                        ? "Еженедельно"
                        : "Ежедневно"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Тренер</h3>
            {groupClass.trainer ? (
              <div className="flex items-start gap-4">
                {groupClass.trainer.avatar_url && (
                  <img
                    src={groupClass.trainer.avatar_url}
                    alt={`${groupClass.trainer.name} ${groupClass.trainer.last_name}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white">
                    {groupClass.trainer.name} {groupClass.trainer.last_name}
                  </h4>
                  {groupClass.trainer.bio && (
                    <p className="text-gray-300 mt-2">
                      {groupClass.trainer.bio}
                    </p>
                  )}
                  {groupClass.trainer.specialties && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm">Специализация:</p>
                      <p className="text-white">
                        {groupClass.trainer.specialties}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Тренер не назначен</p>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        {groupClass.service?.description && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">О занятии</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line">
                {groupClass.service.description}
              </p>
            </div>
          </div>
        )}

        {/* Кнопка возврата */}
        <div className="text-center">
          <Link
            href="/group-classes"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Вернуться к списку занятий
          </Link>
        </div>
      </div>
    </div>
  );
}
