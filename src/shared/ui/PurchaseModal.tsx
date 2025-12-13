"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Предполагается, что у вас установлен react-hot-toast
import { useQueryClient } from "@tanstack/react-query"; // 👈 НОВЫЙ ИМПОРТ

// Интерфейс Service, унифицированный: используем 'title'
interface Service {
  id: number;
  title: string;
  price_cents: number;
  duration_days: number;
}

interface PurchaseModalProps {
  service: Service | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function PurchaseModal({
  service,
  onClose,
  isOpen,
}: PurchaseModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient(); // 👈 Инициализация Query Client

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cash" | "online"
  >("card");
  const [isLoading, setIsLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Сброс состояния при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      setCouponCode("");
      setDiscountPercent(0);
      setCouponMessage(null);
    }
  }, [isOpen]);

  const basePrice = service ? service.price_cents / 100 : 0;

  // Расчет финальной цены
  const finalPrice = useMemo(() => {
    if (!service) return 0;
    return basePrice * (1 - discountPercent / 100);
  }, [service, basePrice, discountPercent]);

  // Проверка купона
  const checkCoupon = useCallback(async () => {
    if (!couponCode) {
      setCouponMessage(null);
      setDiscountPercent(0);
      return;
    }

    try {
      const response = await api.post("/coupons/check", { code: couponCode });
      setDiscountPercent(response.data.discount_percent);
      setCouponMessage(response.data.message);
    } catch (error: any) {
      setDiscountPercent(0);
      const errorMessage =
        error.response?.data?.message || "Неверный или неактивный промокод.";
      setCouponMessage(errorMessage);
    }
  }, [couponCode]);

  // Функция для обработки покупки
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setIsLoading(true);

    try {
      // Отправка данных на бэкенд
      await api.post("/purchase", {
        service_id: service.id,
        coupon_code: couponCode || undefined,
        payment_method: paymentMethod,
        // Добавьте finalPrice для проверки на стороне сервера, если нужно
        final_amount_cents: finalPrice * 100,
      });

      // 🚨 КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: СБРОС КЕША ДЛЯ MEMBERSHIPS
      await queryClient.invalidateQueries({ queryKey: ["memberships"] });

      toast.success(`Покупка абонемента "${service.title}" успешно завершена!`);
      onClose();
      // Перенаправление на дашборд (опционально)
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Произошла ошибка при покупке.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !service) return null;

  // Компонент-обертка для модального окна (Tailwind/DaisyUI)
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-semibold">Оформление: {service.title}</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Промокод */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-white/80">Промокод</label>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#1E79AD]"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                type="button"
                onClick={checkCoupon}
                className="bg-[#1E79AD] hover:bg-[#145073] px-4 rounded-lg"
              >
                OK
              </button>
            </div>
            {couponMessage && (
              <p
                className={`mt-2 text-sm ${
                  discountPercent ? "text-green-400" : "text-red-400"
                }`}
              >
                {couponMessage}
              </p>
            )}
          </div>

          {/* Итог */}
          <div className="border-t border-white/10 pt-4 mb-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Итого:</span>
              <span className="text-[#1E79AD]">
                {finalPrice.toLocaleString("ru-RU", {
                  maximumFractionDigits: 0,
                })}{" "}
                ₽
              </span>
            </div>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-[#1E79AD] hover:bg-[#145073] py-3 rounded-xl font-semibold transition"
          >
            {isLoading ? "Обработка..." : "Оплатить"}
          </button>
        </form>
      </div>
    </div>
  );
}
