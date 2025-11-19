// components/ProtectedRoute.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, loadUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          await loadUser();
        } catch {
          // loadUser сам вызовет logout() при ошибке
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token, loadUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!token || !user) {
    router.replace('/login');
    return null;
  }

  return <>{children}</>;
}