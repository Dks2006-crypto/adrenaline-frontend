"use client";

import { useState, useCallback } from "react";
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
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  // 1. Определяем тип записи и заголовок
  const isPersonalBooking = trainerId !== null && classId === null;
  const isGroupBooking = classId !== null && trainerId === null;
  
  // Определяем, что отправлять в API. 
  // Бэкенд должен принять только один из ID: class_id ИЛИ trainer_id.
  const payload = {
    ...(isGroupBooking ? { form_id: classId } : {}),
    ...(isPersonalBooking ? { trainer_id: trainerId } : {}),
    note: note.trim() || null, 
  };

  const title = isPersonalBooking 
    ? "Запрос на персональную тренировку" 
    : isGroupBooking 
    ? "Запись на групповое занятие" 
    : "Оформление записи";

  // 2. Настройка мутации (отправка данных на сервер)
  const mutation = useMutation({
    mutationFn: (data: typeof payload) => {
      // POST /api/bookings
      return api.post("/bookings", data);
    },
    onSuccess: () => {
      // Обновляем список записей в личном кабинете
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      
      toast.success(
        isPersonalBooking
          ? "Запрос отправлен. Тренер свяжется с вами!"
          : "Вы успешно записаны на занятие!"
      );
      setNote("");
      onSuccess(); // Закрыть модалку в родительском компоненте
    },
    onError: (error: any) => {
      console.error("Booking failed:", error);
      const errorMessage =
        error.response?.data?.error || 
        "Не удалось оформить запись. Проверьте вашу подписку.";
      toast.error(errorMessage);
    },
  });

  // 3. Обработчик отправки формы
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!trainerId && !classId) {
        toast.error("Не выбран тренер или занятие.");
        return;
      }

      mutation.mutate(payload);
    },
    [mutation, payload, trainerId, classId]
  );
  
  // Рендер кнопки подтверждения
  const renderSubmitButton = () => {
    const defaultText = isPersonalBooking ? "Отправить запрос" : "Записаться";
    return (
      <button
        type="submit"
        disabled={mutation.isPending || (!trainerId && !classId)}
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? "Обработка..." : defaultText}
      </button>
    );
  };

  // 4. Разметка модального окна
  return (
    // Модальное окно (фон и позиционирование)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Контейнер контента модалки */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 m-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Предотвращение закрытия при клике внутри
      >
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
            aria-label="Закрыть модальное окно"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          {isPersonalBooking
            ? "Укажите удобное время, дату и ваши цели. Тренер свяжется с вами для согласования деталей."
            : "Вы будете записаны на занятие. Ваши данные будут использованы для проверки наличия активного абонемента."}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Поле для заметок/пожеланий */}
          <div className="mb-6">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ваши пожелания (время, дата, цель)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder={isPersonalBooking 
                ? "Например: 'Хочу тренироваться по вторникам и четвергам в 19:00. Цель — набор массы.'"
                : "Если это групповое занятие, можете оставить краткий комментарий для тренера."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Предупреждение о подписке */}
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg mb-6">
            <p className="text-sm font-medium">
              ⚠️ Важно: Для любой записи необходима{" "}
              <span className="font-bold">активная подписка</span>{" "}
              или{" "}
              <span className="font-bold">достаточное количество посещений</span>{" "}
              на вашем абонементе.
            </p>
          </div>

          {renderSubmitButton()}
        </form>
      </div>
    </div>
  );
}