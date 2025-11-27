'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ServiceCard from '@/shared/ui/ServiceCard';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((res) => res.data),
  });

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Услуги и тарифы</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services?.map((service: any) => (
          <ServiceCard
            key={service.id}
            title={service.name}
            description={service.description}
            price={service.price_cents / 100}
            duration={service.duration_days}
            onClick={() => router.push(`/services/${service.id}`)}
          />
        ))}
      </div>
    </div>
  );
}