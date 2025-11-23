"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useEffect, useMemo, useState } from 'react'; // 👈 Добавляем useMemo и useState
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Интерфейс для записи, получаемой тренером
interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  note: string | null;
  trainer_comment: string | null;
  created_at: string;
  // Тренерские записи могут быть либо групповыми (class_id), либо персональными
  class_id: number | null;
  user: { // Информация о клиенте
    name: string;
    phone: string;
    email: string;
  };
  // Если запись связана с формой (групповое занятие)
  form: {
    starts_at: string;
    ends_at: string;
    service: { title: string };
  } | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed": return "bg-green-100 text-green-800 border-green-200";
    case "cancelled": return "bg-red-100 text-red-800 border-red-200";
    case "pending":   return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:          return "bg-gray-100 text-gray-800 border-gray-200";
  }
};


export default function TrainerDashboard() {
  const { user, hasRole } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  // 🚨 Перенаправляем, если пользователь не имеет роли тренера (role_id = 2)
  useEffect(() => {
    if (user && !hasRole(2)) router.push('/dashboard');
  }, [hasRole, router, user]);

  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['trainer-bookings'],
    // 🚨 Используем новый API-маршрут
    queryFn: () => api.get('/trainer/bookings').then((res) => res.data),
    enabled: hasRole(2), // Запускаем запрос, только если это тренер
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/trainer/bookings/${id}`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainer-bookings'] });
      toast.success(
        `Запись ${variables.id} ${
          variables.status === 'confirmed' ? 'подтверждена' : 'отменена'
        }`
      );
    },
    onError: () => {
      toast.error('Ошибка при обновлении статуса записи.');
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, trainer_comment }: { id: number; trainer_comment: string }) =>
      api.patch(`/trainer/bookings/${id}/comment`, { trainer_comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-bookings'] });
      toast.success('Комментарий обновлен');
      setEditingComment(null);
      setCommentText('');
    },
    onError: () => {
      toast.error('Ошибка при обновлении комментария.');
    },
  });

  const pendingBookings = useMemo(() => bookings.filter(b => b.status === 'pending'), [bookings]);
  const confirmedBookings = useMemo(() => bookings.filter(b => b.status !== 'pending'), [bookings]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Кабинет тренера</h1>
            <div className="text-center py-12 text-gray-500">Загрузка записей...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Личный кабинет, {user?.name}
            </h1>
            <p className="text-gray-500 mb-12">Управление вашими записями и расписанием.</p>

            {/* Секция ожидающих записей */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-yellow-700 border-b pb-2">
                    Записи на подтверждение ({pendingBookings.length})
                </h2>
                {pendingBookings.length === 0 ? (
                    <p className="text-gray-500">Нет записей, ожидающих подтверждения.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingBookings.map((b) => (
                            <div key={b.id} className="bg-yellow-50 p-6 rounded-xl shadow-md border-l-4 border-yellow-400">
                                <h3 className="font-bold text-lg mb-2">
                                    Клиент: {b.user.name}
                                </h3>
                                
                                <p className="text-sm text-gray-600">
                                    **Тип:** {b.class_id ? 'Групповое занятие' : 'Персональная тренировка'}
                                </p>

                                {b.form && (
                                    <p className="text-sm text-gray-600">
                                        **Время:** {format(new Date(b.form.starts_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    **Контакты:** {b.user.phone} / {b.user.email}
                                </p>
                                {b.note && (
                                    <p className="text-sm italic mt-2 p-2 bg-yellow-100 rounded">
                                        **Заметка:** {b.note}
                                    </p>
                                )}

                                <div className="mt-2">
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
                                                        setCommentText('');
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
                                                {b.trainer_comment || 'Нет комментария'}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setEditingComment(b.id);
                                                    setCommentText(b.trainer_comment || '');
                                                }}
                                                className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                            >
                                                ✏️
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: b.id, status: 'confirmed' })}
                                        disabled={updateStatusMutation.isPending}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-70"
                                    >
                                        Подтвердить
                                    </button>
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ id: b.id, status: 'cancelled' })}
                                        disabled={updateStatusMutation.isPending}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-70"
                                    >
                                        Отменить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            
            {/* Секция подтвержденных/отмененных записей */}
            <details>
                <summary className="text-2xl font-bold mb-6 text-gray-700 cursor-pointer border-b pb-2">
                    История записей ({confirmedBookings.length})
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {confirmedBookings.map((b) => (
                        <div 
                            key={b.id} 
                            className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${b.status === 'confirmed' ? 'border-green-400' : 'border-gray-400'}`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg mb-1">
                                    {b.user.name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>
                                    {b.status === 'confirmed' ? 'Подтверждено' : 'Отменено'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {b.class_id ? `Групповое: ${b.form?.service.title}` : 'Персональная тренировка'}
                            </p>
                        </div>
                    ))}
                </div>
            </details>
        </div>
      </div>
    </ProtectedRoute>
  );
}