"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trainerId: number | null;
  classId: number | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSuccess,
  trainerId,
  classId,
}: BookingModalProps) {
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const isPersonalBooking = trainerId !== null && classId === null;
  const isGroupBooking = classId !== null && trainerId === null;

  // Формируем заметку
  const combinedNote = useMemo(() => {
    const parts = [];
    if (preferredDate) parts.push(`Дата: ${new Date(preferredDate).toLocaleDateString("ru-RU")}`);
    if (preferredTime) parts.push(`Время: ${preferredTime}`);
    if (note.trim()) parts.push(`Комментарий: ${note.trim()}`);
    return parts.length > 0 ? parts.join("\n") : "";
  }, [preferredDate, preferredTime, note]);

  const payload = useMemo(() => ({
    ...(isGroupBooking ? { class_id: classId } : {}),
    ...(isPersonalBooking ? { trainer_id: trainerId } : {}),
    ...(combinedNote ? { note: combinedNote } : {}),
  }), [isGroupBooking, classId, isPersonalBooking, trainerId, combinedNote]);

  const mutation = useMutation({
    mutationFn: (data: typeof payload) => api.post("/bookings", data),
    onSuccess: () => {
      toast.success(isPersonalBooking ? "Запрос отправлен тренеру!" : "Вы успешно записаны!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ошибка записи. Проверьте подписку.");
    },
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isPersonalBooking && !preferredDate) {
      toast.error("Выберите желаемую дату");
      return;
    }
    mutation.mutate(payload);
  }, [mutation, payload, isPersonalBooking]);

  // Блокировка скролла фона
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="p-6 pb-4 text-center border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {isPersonalBooking ? "Персональная тренировка" : "Запись на занятие"}
          </h2>
        </div>

        {/* Скроллируемый контент */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isPersonalBooking && (
              <>
                {/* Дата */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Желаемая дата <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 rounded-xl text-white focus:border-[#1E79AD] focus:ring-2 focus:ring-[#1E79AD]/50 transition"
                  />
                </div>

                {/* Время */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Желаемое время
                  </label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 rounded-xl text-white focus:border-[#1E79AD] focus:ring-2 focus:ring-[#1E79AD]/50 transition"
                  />
                </div>
              </>
            )}

            {/* Комментарий */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Дополнительно
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Опыт тренировок, цели, пожелания..."
                className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 rounded-xl text-white focus:border-[#1E79AD] focus:ring-2 focus:ring-[#1E79AD]/50 transition resize-none"
              />
            </div>

            {/* Инфо-блок */}
            <div className="p-4 bg-[#1E79AD]/10 border border-[#1E79AD]/30 rounded-xl text-[#1E79AD] text-sm">
              <p className="font-medium">Требуется активная подписка</p>
              <p className="mt-1 text-xs opacity-90">
                {isPersonalBooking
                  ? "Тренер свяжется с вами для подтверждения"
                  : "Запись подтверждена при наличии мест"}
              </p>
            </div>

            {/* Ошибка */}
            {mutation.isError && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-300 text-sm text-center">
                {(mutation.error as any).response?.data?.error || "Ошибка записи"}
              </div>
            )}
          </form>
        </div>

        {/* Фиксированные кнопки внизу */}
        <div className="p-6 pt-4 border-t border-white/10">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-[#0b0b0b] border border-white/10 text-white/80 rounded-xl hover:bg-white/5 transition font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending || (isPersonalBooking && !preferredDate)}
              className="flex-1 py-3.5 bg-[#1E79AD] text-white font-bold rounded-xl hover:bg-[#145073] disabled:bg-gray-700 disabled:cursor-not-allowed transition"
            >
              {mutation.isPending ? "Отправка..." : isPersonalBooking ? "Отправить запрос" : "Записаться"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}