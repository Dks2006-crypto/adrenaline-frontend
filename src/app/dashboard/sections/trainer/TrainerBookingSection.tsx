"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

interface Booking {
  id: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  note: string | null;
  trainer_comment: string | null;
  user: {
    id: number;
    name: string;
    phone: string | null;
    email: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function TrainerBookingsSection() {
  const queryClient = useQueryClient();
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["trainer-bookings"],
    // Используем эндпоинт из TrainerController
    queryFn: () => api.get("/trainer/bookings").then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/trainer/bookings/${id}`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trainer-bookings"] });
      toast.success(
        `Запись ${variables.id} ${
          variables.status === "confirmed" ? "подтверждена" : "отменена"
        }`
      );
    },
    onError: () => {
      toast.error("Ошибка при обновлении статуса записи.");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, trainer_comment }: { id: number; trainer_comment: string }) =>
      api.patch(`/trainer/bookings/${id}/comment`, { trainer_comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-bookings"] });
      toast.success("Комментарий обновлен");
      setEditingComment(null);
      setCommentText("");
    },
    onError: () => {
      toast.error("Ошибка при обновлении комментария.");
    },
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Записи клиентов</h2>
        <div className="text-center py-12 text-gray-500">Загрузка записей...</div>
      </section>
    );
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const otherBookings = bookings.filter((b) => b.status !== "pending");

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Записи клиентов ({pendingBookings.length} в ожидании)
      </h2>

      {pendingBookings.length === 0 && otherBookings.length === 0 ? (
        <p className="text-center py-8 text-gray-500 bg-white rounded-xl shadow">
          У вас пока нет активных записей.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl shadow-lg border border-yellow-300 p-6 relative hover:shadow-xl transition"
            >
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  b.status
                )} absolute top-4 right-4`}
              >
                Ожидает
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Запрос на тренировку (№{b.id})
              </h3>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Клиент:</span> {b.user.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Контакты:</span> {b.user.phone || b.user.email}
                </p>

                {b.note && (
                  <p className="text-gray-600 italic border-t border-gray-100 pt-2 mt-2">
                    <span className="font-medium">Пожелания:</span> {b.note}
                  </p>
                )}

                <div className="border-t border-gray-100 pt-2 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий тренера:
                  </label>
                  {editingComment === b.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows={3}
                        placeholder="Добавьте комментарий..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateCommentMutation.mutate({ id: b.id, trainer_comment: commentText })}
                          disabled={updateCommentMutation.isPending}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-70"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null);
                            setCommentText("");
                          }}
                          className="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-600 italic flex-1">
                        {b.trainer_comment || "Нет комментария"}
                      </p>
                      <button
                        onClick={() => {
                          setEditingComment(b.id);
                          setCommentText(b.trainer_comment || "");
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 pt-2">
                  Создана:{" "}
                  {format(new Date(b.created_at), "d MMMM yyyy, HH:mm", {
                    locale: ru,
                  })}
                </p>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    updateStatusMutation.mutate({ id: b.id, status: "confirmed" })
                  }
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-70"
                >
                  Подтвердить
                </button>
                <button
                  onClick={() =>
                    updateStatusMutation.mutate({ id: b.id, status: "cancelled" })
                  }
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-2 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition disabled:opacity-70"
                >
                  Отменить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Отображение других записей (подтвержденных/отмененных) */}
      {otherBookings.length > 0 && (
        <details className="mt-12 border-t pt-8">
          <summary className="text-xl font-bold text-gray-500 cursor-pointer">
            Показать другие записи ({otherBookings.length})
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {otherBookings.map((b) => (
              <div
                key={b.id}
                className="bg-gray-50 rounded-2xl shadow-sm border p-6 opacity-70"
              >
                <h3 className="text-lg font-bold text-gray-500 mb-3">
                  Запись №{b.id}
                </h3>
                <p className="text-sm text-gray-500">
                  Клиент: {b.user.name}
                  <br />
                  Статус:{" "}
                  <span className={`font-medium ${getStatusColor(b.status)}`}>
                    {b.status === "confirmed" ? "Подтверждено" : "Отменено"}
                  </span>
                </p>
                {b.note && (
                  <p className="text-xs text-gray-500 italic mt-2">
                    Пожелания: {b.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}