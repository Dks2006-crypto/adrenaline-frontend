'use client';

import ProtectedRoute from '@/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // 👈 Добавлено useMutation и useQueryClient
import api from '@/lib/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast'; // 👈 Добавлен toast

interface Booking {
  id: number;
  status: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  note: string;
  created_at: string;
}

export default function TrainerDashboard() {
  const { user, hasRole } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient(); // 👈 Инициализация QueryClient

  useEffect(() => {
    // ID роли 'trainer' — 2 (если следовать стандартной практике)
    if (!hasRole(2)) router.push('/dashboard');
  }, [hasRole, router]);

  // Запрос на получение записей для тренера
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['trainer-bookings'],
    queryFn: () => api.get('/trainer/bookings').then((res) => res.data),
  });

  // Мутация для обновления статуса записи
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'confirmed' | 'cancelled' }) => {
      return api.patch(`/trainer/bookings/${id}`, { status });
    },
    onSuccess: () => {
      toast.success('Статус записи обновлен!');
      // Инвалидируем кэш, чтобы список записей обновился
      queryClient.invalidateQueries({ queryKey: ['trainer-bookings'] });
      // Также можно обновить записи клиента, чтобы он увидел изменение
      queryClient.invalidateQueries({ queryKey: ['bookings'] }); 
    },
    onError: (error) => {
      console.error(error);
      toast.error('Ошибка при обновлении статуса.');
    },
  });

  const handleUpdateStatus = (id: number, status: 'confirmed' | 'cancelled') => {
    updateStatusMutation.mutate({ id, status });
  };
  
  // Хелпер для цвета статуса
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div></div>

        </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 border-b pb-4">
          👋 Кабинет тренера
        </h1>
        
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-700">
            Запросы на персональные тренировки ({bookings?.length || 0})
          </h2>
          
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div 
                  key={b.id} 
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Запись №{b.id} от {new Date(b.created_at).toLocaleDateString()}</p>
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      Клиент: {b.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      **Контакты:** {b.user.email} / {b.user.phone || 'Нет телефона'}
                    </p>
                    {b.note && (
                      <p className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                        <span className="font-medium">Примечание:</span> {b.note}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <span 
                      className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(b.status)}`}
                    >
                      {b.status === 'confirmed' ? 'Подтверждено' : b.status === 'cancelled' ? 'Отменено' : 'Ожидает'}
                    </span>
                    
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          disabled={updateStatusMutation.isPending}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50"
                        >
                          Подтвердить
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                          disabled={updateStatusMutation.isPending}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10 border rounded-lg bg-white">
              На данный момент у вас нет ожидающих или активных персональных записей.
            </p>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}