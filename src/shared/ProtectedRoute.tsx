// components/ProtectedRoute.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, loadUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
      <div></div>
    );
  }

  if (!token || !user) {
    return null
  }

  return <>{children}</>;
}