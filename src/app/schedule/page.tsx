'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState(null);

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get('/classes').then((res) => res.data),
  });

  const bookMutation = useMutation({
    mutationFn: (formId: number) => api.post('/bookings', { form_id: formId }),
    onSuccess: () => toast.success('Запись подтверждена'),
    onError: () => toast.error('Нет мест или подписки'),
  });

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Расписание занятий</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes?.map((cls: any) => (
          <div key={cls.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{cls.service.name}</h3>
            <p>Дата: {cls.date}</p>
            <p>Мест: {cls.available_slots}</p>
            <button
              onClick={() => bookMutation.mutate(cls.id)}
              className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={cls.available_slots <= 0}
            >
              Записаться
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}