'use client';

import { useState, useCallback, useMemo } from "react";
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
  // --- 1. ВСЕ ХУКИ (ОБЯЗАТЕЛЬНО БЕЗ УСЛОВИЙ) ---
  const [note, setNote] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [goals, setGoals] = useState("");
  const queryClient = useQueryClient();

  // Определяем тип записи и payload UNCONDITIONALLY
  const isPersonalBooking = trainerId !== null && classId === null;
  const isGroupBooking = classId !== null && trainerId === null;

  const combinedNote = useMemo(() => {
    let noteText = note.trim();
    if (preferredDate || preferredTime || trainingType || goals) {
      const details = [];
      if (preferredDate) details.push(`Предпочитаемая дата: ${preferredDate}`);
      if (preferredTime) details.push(`Предпочитаемое время: ${preferredTime}`);
      if (trainingType) details.push(`Тип тренировки: ${trainingType}`);
      if (goals) details.push(`Цели: ${goals}`);
      noteText += (noteText ? "\n\n" : "") + details.join("\n");
    }
    return noteText;
  }, [note, preferredDate, preferredTime, trainingType, goals]);

  const payload = useMemo(() => ({
    ...(isGroupBooking ? { form_id: classId } : {}),
    ...(isPersonalBooking ? { trainer_id: trainerId } : {}),
    ...(combinedNote ? { note: combinedNote } : {}),
  }), [isGroupBooking, classId, isPersonalBooking, trainerId, combinedNote]);

  const mutation = useMutation({
    mutationFn: (data: typeof payload) => {
      console.log("Отправка бронирования:", data);
      return api.post("/bookings", data);
    },
    onSuccess: (res) => {
      console.log("Успешное бронирование:", res.data);
      toast.success(res.data.message || "Запись подтверждена/отправлена.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Ошибка бронирования:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Ошибка при записи. Проверьте вашу подписку.");
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Убедимся, что выбран валидный тип бронирования
      if (!isPersonalBooking && !isGroupBooking) {
        toast.error("Необходимо выбрать занятие или тренера.");
        return;
      }
      mutation.mutate(payload);
    },
    [mutation, payload, isPersonalBooking, isGroupBooking]
  );

  // --- 2. УСЛОВНЫЙ ВОЗВРАТ (ПОСЛЕ ВСЕХ ХУКОВ) ---
  if (!isOpen) return null;

  // --- 3. ОСТАЛЬНАЯ ЛОГИКА / JSX ---
  const title = isPersonalBooking
    ? "🎯 Запрос на персональную тренировку"
    : isGroupBooking
    ? "📅 Запись на групповое занятие"
    : "Ошибка: Неверный тип записи";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-2xl"
          >
            ×
          </button>
        </div>

        {/* Форма */}
        <form className="p-6" onSubmit={handleSubmit}>
          {isPersonalBooking && (
            <div className="space-y-6 mb-6">
              {/* Предпочитаемая дата */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  📅 Предпочитаемая дата
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Предпочитаемое время */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🕐 Предпочитаемое время
                </label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Тип тренировки */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🏋️‍♂️ Тип тренировки
                </label>
                <select
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Выберите тип</option>
                  <option value="Онлайн">Онлайн</option>
                  <option value="В зале">В зале</option>
                  <option value="На улице">На улице</option>
                </select>
              </div>

              {/* Цели */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🎯 Ваши цели
                </label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  placeholder="Например: набор массы, похудение, улучшение выносливости..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Дополнительные пожелания */}
          <div className="mb-6">
            <label
              htmlFor="note"
              className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
            >
              💬 Дополнительные пожелания
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder={isPersonalBooking
                ? "Расскажите о вашем опыте, предпочтениях или любых особых требованиях..."
                : "Если это групповое занятие, можете оставить краткий комментарий для тренера."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Предупреждение о подписке */}
          <div className="p-4 bg-linear-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 text-yellow-800 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-sm font-medium">
                  Для записи необходима <span className="font-bold">активная подписка</span> или <span className="font-bold">достаточное количество посещений</span>.
                </p>
                {isPersonalBooking && (
                  <p className="text-xs mt-2 text-yellow-700">
                    Ваш запрос будет отправлен тренеру для подтверждения. Он свяжется с вами в ближайшее время.
                  </p>
                )}
                {isGroupBooking && (
                  <p className="text-xs mt-2 text-yellow-700">
                    Запись будет подтверждена автоматически при наличии свободных мест.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-3 px-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              {mutation.isPending
                ? "Отправка..."
                : isPersonalBooking
                ? "📤 Отправить запрос"
                : "✅ Записаться"}
            </button>
          </div>

          {/* Сообщение об ошибке */}
          {mutation.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">
                Произошла ошибка: {(mutation.error as any).response?.data?.error || mutation.error.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}