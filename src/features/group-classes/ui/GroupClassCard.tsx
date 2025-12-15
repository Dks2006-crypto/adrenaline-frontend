import Link from "next/link";
import { GroupClassCardProps } from './types';

/* V-декорация */
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

export default function GroupClassCard({ groupClass }: GroupClassCardProps) {
  const date = new Date(groupClass.starts_at);
  const timeStart = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEnd = new Date(groupClass.ends_at).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
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
        {groupClass.title}
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
          <span className="font-medium">{groupClass.capacity} человек</span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/60">Свободно мест:</span>
          <span className={`font-bold ${groupClass.available_slots <= 3 ? "text-red-400" : "text-green-400"}`}>
            {groupClass.available_slots}
          </span>
        </div>

        {groupClass.service && (
          <div className="flex justify-between">
            <span className="text-white/60">Программа:</span>
            <span className="text-right font-medium">{groupClass.service.title}</span>
          </div>
        )}

        {groupClass.trainer && (
          <div className="flex justify-between">
            <span className="text-white/60">Тренер:</span>
            <span className="text-right font-medium">
              {groupClass.trainer.name} {groupClass.trainer.last_name || ""}
            </span>
          </div>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex gap-4 mt-auto">
        <Link
          href={`/group-classes/${groupClass.id}`}
          className="flex-1 text-center bg-[#1E79AD]/20 hover:bg-[#1E79AD]/30 text-[#1E79AD] py-3.5 rounded-xl font-semibold transition"
        >
          Подробнее
        </Link>

        {groupClass.available_slots > 0 ? (
          <Link
            href={`/group-classes/${groupClass.id}`}
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
}