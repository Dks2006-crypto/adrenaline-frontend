"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { GroupClassListItem } from "@/features/group-classes/model/types";

export default function GroupClasses() {
  const [groupClasses, setGroupClasses] = useState<GroupClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchGroupClasses = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/api/group-classes`);

        if (!response.ok) throw new Error("Не удалось загрузить занятия");
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

  /* Декоративные перекрёстные стрелки — как в Pricing и на скриншоте */
  const CrossDecor = () => (
<div className="flex justify-center items-center mb-8 w-32 h-32 relative mx-auto">
  {/* Белая перевёрнутая V сзади (полупрозрачная, чуть меньше и тоньше) */}
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

  {/* Синяя нормальная V спереди (больше, толще, яркая) */}
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
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#1E79AD] text-white px-6 py-3 rounded-xl text-lg font-semibold">
              ГРУППОВЫЕ ЗАНЯТИЯ
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#121212] border border-white/10 rounded-2xl p-8 animate-pulse"
              >
                <div className="h-6 bg-white/10 rounded mb-6 mx-auto w-32"></div>
                <div className="h-5 bg-white/10 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || groupClasses.length === 0) {
    return (
      <section className="py-24 bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#1E79AD] text-white px-6 py-3 rounded-xl text-lg font-semibold">
              ГРУППОВЫЕ ЗАНЯТИЯ
            </span>
          </div>
          <div className="text-center text-white/70 text-lg">
            {error || "В настоящее время нет доступных групповых занятий."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#0b0b0b]" id="group-classes">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <div className="mb-12">
          <span className="inline-block bg-[#1E79AD] text-white px-6 py-3 rounded-xl text-lg font-semibold">
            ГРУППОВЫЕ ЗАНЯТИЯ
          </span>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  transition-all duration-300
                  group
                "
              >
                {/* Перекрёстные стрелки */}
                <CrossDecor />

                {/* Название занятия */}
                <h3 className="text-white font-bold text-xl text-center mb-6">
                  {cls.title}
                </h3>

                {/* Информация */}
                <div className="space-y-4 text-sm text-white/80 mb-8 flex-1">
                  <div className="flex justify-between">
                    <span className="text-white/60">Когда:</span>
                    <span className="text-right">
                      {date.toLocaleDateString("ru-RU")} {timeStart}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Количество человек:</span>
                    <span>{cls.capacity} чел.</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Программа:</span>
                    <span className="text-right">
                      {cls.service?.title || "Стандартная"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Время занятия:</span>
                    <span>
                      {timeStart}–{timeEnd}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/60">Тренер:</span>
                    <span className="text-right">
                      {cls.trainer
                        ? `${cls.trainer.name} ${cls.trainer.last_name || ""}`
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 mt-auto">
                  <Link
                    href={`/group-classes/${cls.id}`}
                    className="flex-1 text-center bg-[#1E79AD]/20 hover:bg-[#1E79AD]/30 text-[#1E79AD] py-3 rounded-xl font-medium transition"
                  >
                    Подробнее
                  </Link>

                  {cls.available_slots > 0 ? (
                    <Link
                      href={`/group-classes/${cls.id}`}
                      className="flex-1 text-center bg-[#1E79AD] hover:bg-[#145073] text-white py-3 rounded-xl font-medium transition"
                    >
                      Записаться
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-1 text-center bg-gray-700 text-gray-500 py-3 rounded-xl cursor-not-allowed"
                    >
                      Нет мест
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Нижняя кнопка */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/group-classes"
            className="bg-[#1E79AD] hover:bg-[#145073] text-white px-8 py-4 rounded-xl transition text-lg font-medium"
          >
            Все занятия
          </Link>
        </div>
      </div>
    </section>
  );
}
