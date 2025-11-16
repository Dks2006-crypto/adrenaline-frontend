'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loadUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      loadUser();
    }
  }, [token, router, loadUser]);

  if (!token) return null;

  return <>{children}</>;
}