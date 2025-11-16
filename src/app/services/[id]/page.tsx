'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

const purchaseSchema = z.object({
  coupon_code: z.string().optional(),
  payment_method: z.enum(['card', 'cash', 'online']),
});

export default function ServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => api.get(`/services/${id}`).then((res) => res.data),
  });

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(purchaseSchema),
  });

  const purchaseMutation = useMutation({
    mutationFn: (data: any) => api.post('/purchase', { ...data, service_id: id }),
    onSuccess: () => {
      toast.success('Тариф активирован!');
      router.push('/dashboard');
    },
    onError: () => toast.error('Ошибка покупки'),
  });

  if (isLoading) return <div>Загрузка...</div>;

  const onSubmit = (data: any) => purchaseMutation.mutate(data);

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
        <p className="mb-6">{service.description}</p>
        <p className="text-2xl mb-6">Цена: {service.price_cents / 100} RUB</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-96">
          <input
            {...register('coupon_code')}
            placeholder="Промокод (опционально)"
            className="w-full p-3 mb-4 border rounded"
          />
          <select {...register('payment_method')} className="w-full p-3 mb-4 border rounded">
            <option value="card">Карта</option>
            <option value="cash">Наличные</option>
            <option value="online">Онлайн</option>
          </select>
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
            Купить
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}