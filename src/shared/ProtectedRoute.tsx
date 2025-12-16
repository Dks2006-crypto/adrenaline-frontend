// components/ProtectedRoute.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, loadUser, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Если есть токен но нет пользователя, загружаем пользователя
        if (token && !user) {
          await loadUser();
        }
        // Если нет токена, инициализируем из localStorage
        else if (!token && !user) {
          await initializeAuth();
        }
      } catch (error) {
        // Ошибки обрабатываются в loadUser/initializeAuth
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token, user, loadUser, initializeAuth]);

  // Показываем лоадинг во время инициализации
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если нет токена или пользователя после инициализации, редиректим
  if (!token && !user) {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
}