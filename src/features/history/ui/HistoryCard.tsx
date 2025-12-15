"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { HistoryEntry } from "../model/types";

interface HistoryCardProps {
  entry: HistoryEntry;
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
      return { 
        text: "Групповое занятие", 
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30" 
      };
    case "personal":
      return { 
        text: "Персональная тренировка", 
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30" 
      };
    default:
      return { 
        text: type, 
        color: "bg-gray-500/20 text-gray-400 border-gray-500/30" 
      };
  }
};

export default function HistoryCard({ entry, isTrainer = false }: HistoryCardProps) {
  const status = getStatusConfig(entry.status);
  const type = getTypeConfig(entry.type);
  
  const date = new Date(entry.date);
  const dateStr = format(date, "d MMMM yyyy", { locale: ru });
  const timeStr = `${entry.start_time} - ${entry.end_time}`;
  
  // Determine the title and person name based on context
  const title = entry.group_class 
    ? entry.group_class.title 
    : isTrainer 
      ? "Персональная тренировка"
      : "Персональная тренировка";
      
  const personName = isTrainer 
    ? entry.client 
      ? `${entry.client.name} ${entry.client.last_name || ""}`.trim()
      : "Клиент не указан"
    : entry.group_class?.trainer
      ? `${entry.group_class.trainer.name} ${entry.group_class.trainer.last_name || ""}`.trim()
      : entry.trainer
        ? `${entry.trainer.name} ${entry.trainer.last_name || ""}`.trim()
        : "Тренер не указан";

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 hover:border-[#1E79AD]/50 transition-all duration-300 group">
      {/* Header with type and status */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${type.color}`}>
          {type.text}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
          {status.text}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-lg mb-4 line-clamp-2 overflow-hidden">
        {title}
      </h3>

      {/* Details */}
      <div className="space-y-3 text-sm text-white/80">
        {/* Date and Time */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1E79AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-white/60">Дата:</span>
          <span className="text-white font-medium">{dateStr}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1E79AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white/60">Время:</span>
          <span className="text-white font-medium">{timeStr}</span>
        </div>

        {/* Person */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1E79AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-white/60">
            {isTrainer ? "Клиент:" : "Тренер:"}
          </span>
          <span className="text-white font-medium">{personName}</span>
        </div>

        {/* Service title for group classes */}
        {entry.group_class?.service && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1E79AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white/60">Программа:</span>
            <span className="text-white font-medium line-clamp-1 overflow-hidden">
              {entry.group_class.service.title}
            </span>
          </div>
        )}

        {/* Rating */}
        {entry.rating && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-white/60">Оценка:</span>
            <span className="text-white font-medium">{entry.rating}/5</span>
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-white/60 text-xs mb-1">Заметки:</p>
            <p className="text-white/80 text-sm italic line-clamp-2 overflow-hidden">
              {entry.notes}
            </p>
          </div>
        )}

        {/* Feedback */}
        {entry.feedback && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-[#1E79AD] text-xs mb-1">Отзыв:</p>
            <p className="text-white/80 text-sm line-clamp-2 overflow-hidden">
              {entry.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}