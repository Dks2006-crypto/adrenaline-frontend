"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import PurchaseModal from "@/shared/ui/PurchaseModal";
import Link from "next/link";

interface Benefit {
  benefit: string;
}

interface Service {
  id: number;
  title: string;
  description?: string;
  base_benefits?: Benefit[]; // Новое поле
  duration_days: number;
  visits_limit?: number | null;
  price_cents: number;
  currency: string;
  active: boolean;
  type: "single" | "monthly" | "yearly";
}

export default function Pricing() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api
      .get<Service[]>("/services") // Указываем тип напрямую — массив услуг
      .then((res) => {
        // Если API возвращает массив напрямую — res.data уже массив
        // Если возвращает { data: [...] } — берём res.data.data
        const servicesData = Array.isArray(res.data)
          ? res.data
          : (res.data as any)?.data || [];

        // Фильтруем только активные
        const activeServices = servicesData.filter((s: Service) => s.active);

        setServices(activeServices);
      })
      .catch((e) => {
        console.error("Ошибка загрузки тарифов:", e);
        setServices([]); // На случай ошибки — пустой список
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = (service: Service) => {
    if (!token) {
      router.push("/login");
      return;
    }
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const formatPrice = (priceCents: number) => {
    return (priceCents / 100).toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      <section className="py-24 bg-[#111111]" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          {/* Заголовок */}
          <div className="mb-12">
            <span className="inline-block bg-[#1E79AD] text-white px-4 py-2 rounded-lg text-sm font-semibold">
              АБОНЕМЕНТЫ
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center text-white text-lg">
              Загрузка тарифов...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center text-white/70">
              В настоящее время нет доступных абонементов.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service) => {
                const hasUnlimitedVisits = service.visits_limit === null;

                return (
                  <div
                    key={service.id}
                    className="
                      bg-[#121212]
                      border border-white/10
                      rounded-2xl
                      p-6
                      flex flex-col
                      hover:border-[#1E79AD] hover:shadow-lg
                      transition-all duration-300
                    "
                  >
                    {/* Декоративный элемент */}
                    <div className="flex justify-center items-center">
                      {/* Декоративный элемент — перекрещенные стрелки как на фото */}
                      <div className="flex justify-center items-center mb-8 w-40 h-40 relative">
                        {/* Белая стрелка сзади (повёрнута на -45°) */}
                        <div className="absolute inset-0 flex items-center justify-center rotate-[-45deg]">
                          <div className="w-full h-1 bg-white/30 relative"></div>
                        </div>
                        {/* Синяя стрелка спереди (повёрнута на 45°) */}
                        <div className="absolute inset-0 flex items-center justify-center rotate-45">
                          <div className="w-full h-1 bg-[#1E79AD] relative"></div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-xl text-center mb-3">
                      {service.title}
                    </h3>

                    {service.description && (
                      <p className="text-sm text-white/70 text-center mb-5">
                        {service.description}
                      </p>
                    )}

                    {/* Список преимуществ из base_benefits */}
                    <ul className="text-sm text-white/80 space-y-2 mb-6 flex-1">
                      {service.base_benefits &&
                      service.base_benefits.length > 0 ? (
                        service.base_benefits.map((item, index) => (
                          <li key={index}>• {item.benefit}</li>
                        ))
                      ) : (
                        <>
                          <li>• Срок действия: {service.duration_days} дней</li>
                          <li>
                            •{" "}
                            {hasUnlimitedVisits
                              ? "Безлимитные посещения"
                              : `${service.visits_limit} посещений`}
                          </li>
                          <li>• Душевые и раздевалки</li>
                        </>
                      )}
                    </ul>

                    {/* Цена */}
                    <div className="text-center mb-6">
                      <span className="text-3xl font-bold text-[#1E79AD]">
                        {formatPrice(service.price_cents)} ₽
                      </span>
                      {service.type !== "single" && (
                        <span className="block text-xs text-white/60 mt-1">
                          /{service.type === "monthly" ? "мес" : "год"}
                        </span>
                      )}
                    </div>

                    {/* Кнопка */}
                    <button
                      onClick={() => handleBuy(service)}
                      className="mt-auto bg-[#1E79AD] hover:bg-[#145073] text-white font-medium py-3 rounded-lg transition shadow-md"
                    >
                      Оформить
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
      />
    </>
  );
}
