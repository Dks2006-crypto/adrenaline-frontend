"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { GroupClassListItem } from "@/features/group-classes/model/types";

export default function GroupClassesPage() {
  const [groupClasses, setGroupClasses] = useState<GroupClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchGroupClasses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/api/group-classes`);

        if (!response.ok) throw new Error("Не удалось загрузить групповые занятия");
        const data = await response.json();
        setGroupClasses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupClasses();
  }, []);

  /* Увеличенные V-декорации — как в твоём последнем коде */
  const VDecor = () => (
    <div className="flex justify-center items-center mb-8 w-32 h-32 relative mx-auto">
      {/* Белая перевёрнутая V сзади */}
      <svg
        className="absolute w-52 h-52 opacity-45"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M 22 78 L 50 28 L 78 78"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Синяя нормальная V спереди */}
      <svg
        className="absolute w-52 h-52"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M 20 22 L 50 80 L 80 22"
          fill="none"
          stroke="#1E79AD"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
              ГРУППОВЫЕ ЗАНЯТИЯ
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#121212] border border-white/10 rounded-2xl p-8 animate-pulse"
              >
                <div className="h-32 bg-white/5 rounded-full mb-6 mx-auto"></div>
                <div className="h-6 bg-white/10 rounded mx-auto w-48 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-4/5"></div>
                  <div className="h-4 bg-white/10 rounded w-3/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || groupClasses.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
              ГРУППОВЫЕ ЗАНЯТИЯ
            </span>
          </div>
          <div className="text-center text-white/70 text-xl">
            {error || "В настоящее время нет доступных групповых занятий."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <div className="mb-16 text-center">
          <span className="inline-block bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
            ГРУППОВЫЕ ЗАНЯТИЯ
          </span>
          <p className="mt-6 text-white/70 text-lg max-w-3xl mx-auto">
            Присоединяйтесь к нашим профессиональным групповым тренировкам под руководством опытных тренеров
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {groupClasses.map((cls) => {
            const date = new Date(cls.starts_at);
            const timeStart = date.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const timeEnd = new Date(cls.ends_at).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={cls.id}
                className="
                  bg-[#121212]
                  border border-white/10
                  rounded-2xl
                  p-8
                  flex flex-col
                  hover:border-[#1E79AD]
                  hover:shadow-2xl
                  transition-all duration-300
                  group
                "
              >
                {/* V-декорация */}
                <VDecor />

                {/* Название */}
                <h3 className="text-white font-bold text-2xl text-center mb-8">
                  {cls.title}
                </h3>

                {/* Информация */}
                <div className="space-y-5 text-white/80 mb-10 flex-1">
                  <div className="flex justify-between">
                    <span className="text-white/60">Дата и время:</span>
                    <span className="text-right font-medium">
                      {date.toLocaleDateString("ru-RU")} в {timeStart}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Продолжительность:</span>
                    <span className="font-medium">{timeStart} – {timeEnd}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Вместимость:</span>
                    <span className="font-medium">{cls.capacity} человек</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Свободно мест:</span>
                    <span className={`font-bold ${cls.available_slots <= 3 ? "text-red-400" : "text-green-400"}`}>
                      {cls.available_slots}
                    </span>
                  </div>

                  {cls.service && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Программа:</span>
                      <span className="text-right font-medium">{cls.service.title}</span>
                    </div>
                  )}

                  {cls.trainer && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Тренер:</span>
                      <span className="text-right font-medium">
                        {cls.trainer.name} {cls.trainer.last_name || ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Кнопки */}
                <div className="flex gap-4 mt-auto">
                  <Link
                    href={`/group-classes/${cls.id}`}
                    className="flex-1 text-center bg-[#1E79AD]/20 hover:bg-[#1E79AD]/30 text-[#1E79AD] py-3.5 rounded-xl font-semibold transition"
                  >
                    Подробнее
                  </Link>

                  {cls.available_slots > 0 ? (
                    <Link
                      href={`/group-classes/${cls.id}`}
                      className="flex-1 text-center bg-[#1E79AD] hover:bg-[#145073] text-white py-3.5 rounded-xl font-semibold transition"
                    >
                      Записаться
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-1 text-center bg-gray-700 text-gray-500 py-3.5 rounded-xl cursor-not-allowed font-medium"
                    >
                      Нет мест
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Подвал */}
        {token && (
          <div className="mt-16 flex justify-center items-center gap-16">
            <Link
              href="/dashboard"
              className="inline-block bg-[#1E79AD] hover:bg-[#145073] text-white px-10 py-4 rounded-xl text-lg font-semibold transition"
            >
              Перейти в личный кабинет
            </Link>
            <Link
              href="/"
              className="inline-block bg-[#1E79AD] hover:bg-[#145073] text-white px-10 py-4 rounded-xl text-lg font-semibold transition"
            >
              На главную
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}