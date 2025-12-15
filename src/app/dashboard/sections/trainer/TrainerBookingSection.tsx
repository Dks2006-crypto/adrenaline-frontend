"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { Pencil } from "lucide-react"; // npm i lucide-react (или используй любой SVG)

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
  };
}

export default function TrainerBookingsSection() {
  const queryClient = useQueryClient();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["trainer-bookings"],
    queryFn: () => api.get("/trainer/bookings").then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "confirmed" | "cancelled" }) =>
      api.patch(`/trainer/bookings/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-bookings"] });
      toast.success("Статус заявки обновлён");
    },
    onError: () => toast.error("Ошибка при обновлении статуса"),
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, trainer_comment }: { id: number; trainer_comment: string }) =>
      api.patch(`/trainer/bookings/${id}/comment`, { trainer_comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-bookings"] });
      toast.success("Комментарий сохранён");
      setEditingCommentId(null);
      setCommentText("");
    },
    onError: () => toast.error("Ошибка при сохранении комментария"),
  });

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  if (isLoading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Заявки на тренировку</h2>
        <div className="text-center py-20 text-white/60">Загрузка заявок...</div>
      </section>
    );
  }

  if (pendingBookings.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Заявки на тренировку</h2>
        <div className="text-center py-20 bg-[#121212] rounded-3xl border border-white/10">
          <p className="text-white/60 text-lg">Новых заявок пока нет</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-white mb-8">
        Заявки на тренировку ({pendingBookings.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pendingBookings.map((booking) => (
          <div
            key={booking.id}
            className="
              bg-[#121212]
              border border-white/10
              rounded-3xl
              p-8
              relative
              shadow-2xl
              hover:border-[#1E79AD]/50
              transition-all duration-300
              flex flex-col
            "
          >
            {/* Заголовок + статус на одной строке */}
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white pr-36">
                Запрос на тренировку (№{booking.id})
              </h3>

              {/* Бейдж "Ожидает" */}
              <div className="absolute top-6 right-6 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold px-4 py-2 rounded-full">
                Ожидает
              </div>
            </div>

            {/* Информация о клиенте */}
            <div className="space-y-4 text-white/80 mb-6">
              <p>
                <span className="font-medium text-white">Клиент:</span> {booking.user.name}
              </p>
              <p>
                <span className="font-medium text-white">Контакты:</span>{" "}
                {booking.user.phone || "Не указан"}
              </p>

              {/* Пожелания клиента */}
              {booking.note && (
                <div>
                  <p className="font-medium text-white mb-1">Пожелания:</p>
                  <p className="text-sm italic leading-relaxed">{booking.note}</p>
                </div>
              )}
            </div>

            {/* Комментарий тренера */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-white">Комментарий тренера:</p>
                <button
                  onClick={() => {
                    setEditingCommentId(booking.id);
                    setCommentText(booking.trainer_comment || "");
                  }}
                  className="text-white/60 hover:text-[#1E79AD] transition"
                >
                  <Pencil size={18} />
                </button>
              </div>

              {editingCommentId === booking.id ? (
                <div className="space-y-3">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    placeholder="Добавьте комментарий..."
                    className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#1E79AD] transition resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateCommentMutation.mutate({
                          id: booking.id,
                          trainer_comment: commentText,
                        })
                      }
                      disabled={updateCommentMutation.isPending}
                      className="px-4 py-2 bg-[#1E79AD] text-white rounded-xl hover:bg-[#145073] transition text-sm font-medium"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setCommentText("");
                      }}
                      className="px-4 py-2 border border-white/20 text-white/70 rounded-xl hover:bg-white/5 transition text-sm"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white/60 italic text-sm">
                  {booking.trainer_comment || "Нет комментария"}
                </p>
              )}
            </div>

            {/* Дата создания */}
            <p className="text-xs text-white/50 mb-8">
              Создана: {format(new Date(booking.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
            </p>

            {/* Кнопки действий — всегда внизу */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "confirmed" })}
                disabled={updateStatusMutation.isPending}
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition disabled:opacity-70"
              >
                Подтвердить
              </button>
              <button
                onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "cancelled" })}
                disabled={updateStatusMutation.isPending}
                className="flex-1 py-3 border border-red-500/50 text-red-400 font-bold rounded-2xl hover:bg-red-500/10 transition disabled:opacity-70"
              >
                Отменить
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}