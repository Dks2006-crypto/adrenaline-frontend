'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ждём, пока клиент смонтируется и Zustand загрузит данные
    if (token && user) {
      setIsLoading(false);
    } else if (token === null) {
      // Токена точно нет — редиректим
      router.replace('/login');
    } else {
      // Токен есть, но user ещё не загружен — ждём
      const unsubscribe = useAuthStore.subscribe((state) => {
        if (state.user) {
          setIsLoading(false);
          unsubscribe();
        }
      });

      // Таймаут на случай, если что-то сломалось
      setTimeout(() => {
        if (!user) router.replace('/login');
      }, 3000);

      return () => unsubscribe();
    }
  }, [token, user, router]);

  // Пока проверяем — показываем лоадер (чтобы SSR и клиент совпадали)
  if (isLoading || (!user && token !== null)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  // Если нет токена — ничего не рендерим (редирект уже пошёл)
  if (!token || !user) {
    return null;
  }

  return <>{children}</>;
}