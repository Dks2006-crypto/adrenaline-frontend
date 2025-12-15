import Link from "next/link";
import { GroupClassCardProps } from './types';

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
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex flex-col hover:border-blue-500 transition-colors">
      {/* Простой заголовок */}
      <h3 className="text-white text-xl font-semibold mb-4 line-clamp-2">
        {groupClass.title}
      </h3>

      {/* Базовая информация */}
      <div className="space-y-3 text-gray-300 flex-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Дата:</span>
          <span>{date.toLocaleDateString("ru-RU")}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Время:</span>
          <span>{timeStart} - {timeEnd}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Места:</span>
          <span className={groupClass.available_slots > 0 ? "text-green-400" : "text-red-400"}>
            {groupClass.available_slots} из {groupClass.capacity}
          </span>
        </div>

        {groupClass.trainer && (
          <div className="flex justify-between">
            <span className="text-gray-400">Тренер:</span>
            <span className="text-right">
              {groupClass.trainer.name} {groupClass.trainer.last_name || ""}
            </span>
          </div>
        )}
      </div>

      {/* Простая кнопка */}
      <Link
        href={`/group-classes/${groupClass.id}`}
        className={`mt-6 text-center py-3 rounded-md font-medium transition ${
          groupClass.available_slots > 0
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {groupClass.available_slots > 0 ? "Записаться" : "Нет мест"}
      </Link>
    </div>
  );
}
