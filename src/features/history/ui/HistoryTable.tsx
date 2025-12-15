"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { HistoryEntry } from "../model/types";

interface HistoryTableProps {
  entries: HistoryEntry[];
  isTrainer?: boolean;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return {
        text: "Завершено",
        color: "bg-green-500/20 text-green-400 border-green-500/30"
      };
    case "cancelled":
      return {
        text: "Отменено",
        color: "bg-red-500/20 text-red-400 border-red-500/30"
      };
    case "no_show":
      return {
        text: "Не явился",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      };
    default:
      return {
        text: status,
        color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case "group":
      return "Групповое";
    case "personal":
      return "Персональное";
    default:
      return type;
  }
};

export default function HistoryTable({ entries, isTrainer = false }: HistoryTableProps) {
  const getPersonName = (entry: HistoryEntry) => {
    if (isTrainer) {
      return entry.client
        ? `${entry.client.name} ${entry.client.last_name || ""}`.trim()
        : "Клиент не указан";
    }
    
    return entry.group_class?.trainer
      ? `${entry.group_class.trainer.name} ${entry.group_class.trainer.last_name || ""}`.trim()
      : entry.trainer
        ? `${entry.trainer.name} ${entry.trainer.last_name || ""}`.trim()
        : "Тренер не указан";
  };

  const getTitle = (entry: HistoryEntry) => {
    return entry.group_class
      ? entry.group_class.title
      : "Персональная тренировка";
  };

  if (entries.length === 0) {
    return (
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-white/80 text-xl font-medium mb-2">История пуста</h3>
        <p className="text-white/50">Записи о занятиях не найдены</p>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">Дата</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">Время</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">Занятие</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                {isTrainer ? "Клиент" : "Тренер"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">Тип</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((entry) => {
              const status = getStatusConfig(entry.status);
              const date = new Date(entry.date);
              const dateStr = format(date, "dd.MM.yyyy", { locale: ru });
              const timeStr = `${entry.start_time} - ${entry.end_time}`;
              
              return (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                    {dateStr}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80 whitespace-nowrap">
                    {timeStr}
                  </td>
                  <td className="px-6 py-4 text-sm text-white max-w-xs">
                    <div className="truncate" title={getTitle(entry)}>
                      {getTitle(entry)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80 whitespace-nowrap">
                    {getPersonName(entry)}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80 whitespace-nowrap">
                    {getTypeConfig(entry.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/5">
        {entries.map((entry) => {
          const status = getStatusConfig(entry.status);
          const date = new Date(entry.date);
          const dateStr = format(date, "dd.MM.yyyy", { locale: ru });
          const timeStr = `${entry.start_time} - ${entry.end_time}`;
          
          return (
            <div key={entry.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  {getTitle(entry)}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${status.color}`}>
                  {status.text}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Дата:</span>
                  <span className="ml-2 text-white">{dateStr}</span>
                </div>
                <div>
                  <span className="text-white/60">Время:</span>
                  <span className="ml-2 text-white">{timeStr}</span>
                </div>
                <div>
                  <span className="text-white/60">
                    {isTrainer ? "Клиент:" : "Тренер:"}
                  </span>
                  <span className="ml-2 text-white">{getPersonName(entry)}</span>
                </div>
                <div>
                  <span className="text-white/60">Тип:</span>
                  <span className="ml-2 text-white">{getTypeConfig(entry.type)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
