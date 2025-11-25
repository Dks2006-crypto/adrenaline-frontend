"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import PurchaseModal from "@/shared/ui/ui/PurchaseModal";

// 🚨 ОФИЦИАЛЬНОЕ ОПРЕДЕЛЕНИЕ ИНТЕРФЕЙСА SERVICE
// Используем 'title' вместо 'name'
interface Service {
  id: number;
  title: string; 
  price_cents: number;
  duration_days: number;
  description?: string;
  visits_limit?: number;
}

export default function Pricing() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Используем унифицированный интерфейс Service
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // 1. Загрузка данных
  useEffect(() => {
    api.get('/services')
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Ошибка загрузки тарифов:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Обработка нажатия кнопки "Купить"
  const handleSelectService = (service: Service) => {
    if (!token) {
        router.push('/login');
        return;
    }
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  return (
    <> 
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Клубные карты</h2>
            <p className="text-gray-600 text-lg">Выберите формат, который подходит именно вам.</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => {
                const price = service.price_cents / 100;
                
                return (
                  <div key={service.id} className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition flex flex-col relative bg-white group hover:-translate-y-2 duration-300">
                    
                    {service.duration_days >= 90 && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-2xl rounded-tr-2xl">
                        ЛУЧШИЙ ВЫБОР
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3> {/* ИСПОЛЬЗУЕМ title */}
                    
                    <div className="my-6">
                      <span className="text-4xl font-extrabold text-blue-600">{price.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</span>
                      <span className="text-gray-400 text-sm"> / {service.duration_days} дн.</span>
                    </div>

                    <ul className="space-y-4 mb-8 text-gray-600 grow">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2 font-bold">✓</span>
                        Доступ в тренажерный зал
                      </li>
                      {service.visits_limit ? (
                        <li className="flex items-center">
                          <span className="text-blue-500 mr-2 font-bold">ℹ</span>
                          Количество посещений: <strong>{service.visits_limit}</strong>
                        </li>
                      ) : (
                        <li className="flex items-center">
                          <span className="text-green-500 mr-2 font-bold">✓</span>
                          Безлимитные посещения
                        </li>
                      )}
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2 font-bold">✓</span>
                        Душевые и сауна
                      </li>
                    </ul>

                    <button 
                      onClick={() => handleSelectService(service)}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-md"
                    >
                      Купить абонемент
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PurchaseModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}