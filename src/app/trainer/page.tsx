'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function TrainerDashboard() {
  const { user, hasRole } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasRole(2)) router.push('/dashboard');
  }, [hasRole, router]);

  const { data: bookings } = useQuery({
    queryKey: ['trainer-bookings'],
    queryFn: () => api.get('/trainer/bookings').then((res) => res.data), // Добавь эндпоинт в backend
  });

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Кабинет тренера</h1>
        <section>
          <h2 className="text-2xl font-bold mb-4">Мои записи</h2>
          {bookings?.map((b: any) => (
            <div key={b.id} className="bg-white p-4 rounded shadow mb-2">
              Клиент: {b.user.name} — {b.status}
              {/* Кнопки: Подтвердить/Отменить */}
            </div>
          ))}
        </section>
      </div>
    </ProtectedRoute>
  );
}