'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // Предполагается, что у вас установлен react-hot-toast
import { useQueryClient } from '@tanstack/react-query'; // 👈 НОВЫЙ ИМПОРТ

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

export default function PurchaseModal({ service, onClose, isOpen }: PurchaseModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient(); // 👈 Инициализация Query Client

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'online'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Сброс состояния при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      setCouponCode('');
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
      const response = await api.post('/coupons/check', { code: couponCode });
      setDiscountPercent(response.data.discount_percent);
      setCouponMessage(response.data.message);
    } catch (error: any) {
      setDiscountPercent(0);
      const errorMessage = error.response?.data?.message || 'Неверный или неактивный промокод.';
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
      await api.post('/purchase', {
        service_id: service.id,
        coupon_code: couponCode || undefined,
        payment_method: paymentMethod,
        // Добавьте finalPrice для проверки на стороне сервера, если нужно
        final_amount_cents: finalPrice * 100, 
      });

      // 🚨 КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: СБРОС КЕША ДЛЯ MEMBERSHIPS
      await queryClient.invalidateQueries({ queryKey: ['memberships'] });

      toast.success(`Покупка абонемента "${service.title}" успешно завершена!`);
      onClose();
      // Перенаправление на дашборд (опционально)
      router.push('/dashboard'); 
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Произошла ошибка при покупке.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !service) return null;
  
  // Компонент-обертка для модального окна (Tailwind/DaisyUI)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Оформление покупки: {service.title}</h2> 
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900 text-3xl leading-none transition">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Промокод */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Промокод</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Введите промокод"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition text-gray-900"
              />
              <button
                type="button"
                onClick={checkCoupon}
                className="px-4 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
              >
                Применить
              </button>
            </div>
            {couponMessage && (
              <p className={`mt-2 text-sm ${discountPercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {couponMessage}
              </p>
            )}
          </div>

          {/* Выбор способа оплаты (имитация) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Способ оплаты</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-blue-500 rounded-lg bg-blue-50 cursor-pointer text-gray-900">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                Банковской картой (Онлайн)
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-900">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                Наличными в клубе
              </label>
            </div>
          </div>

          {/* Итоговый расчет */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xl font-semibold mb-2 text-gray-900">
              <span>Итоговая цена:</span>
              <span className="text-blue-600">
                {finalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })}
              </span>
            </div>
            {discountPercent > 0 && (
              <p className="text-sm text-green-600 text-right">Скидка: {discountPercent}% от {basePrice.toFixed(0)} ₽</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !service}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Обработка...' : `Оплатить ${finalPrice.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`}
          </button>
        </form>
      </div>
    </div>
  );
}