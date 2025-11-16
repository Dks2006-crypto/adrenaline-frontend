'use client';

import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  const { data: memberships } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => api.get('/memberships').then((res) => res.data), // Добавь эндпоинт в backend если нужно
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.get('/bookings').then((res) => res.data),
  });

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Личный кабинет, {user?.name}</h1>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">Выйти</button>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Подписки</h2>
          {memberships?.map((m: any) => (
            <div key={m.id} className="bg-white p-4 rounded shadow mb-2">
              {m.service.name} — {m.status} (Осталось: {m.remaining_visits})
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Записи</h2>
          {bookings?.map((b: any) => (
            <div key={b.id} className="bg-white p-4 rounded shadow mb-2">
              {b.form.service.name} — {b.status}
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Профиль</h2>
          <p>Email: {user?.email}</p>
          {/* Добавь форму редактирования профиля с Zod */}
        </section>
      </div>
    </ProtectedRoute>
  );
}