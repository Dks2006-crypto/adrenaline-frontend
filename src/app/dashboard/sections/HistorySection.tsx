"use client";

import { useAuthStore } from "@/store/authStore";
import { TrainerHistorySection, UserHistorySection } from "@/features/history";

export default function HistorySection() {
  const { user } = useAuthStore();
  const isTrainer = user?.role_id === 2;

  if (isTrainer) {
    return <TrainerHistorySection />;
  }

  return <UserHistorySection />;
}