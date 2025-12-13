"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/shared/ProtectedRoute";
import ProfileSection from "./sections/ProfileSections";
import TrainerBookingsSection from "./sections/trainer/TrainerBookingSection";
import MembershipsSection from "./sections/user/MembershipsSection";
import BookingsSection from "./sections/user/BookingsSection";
export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const isTrainer = user?.role_id === 2;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#262626] from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
          {/* Шапка */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Привет, {user?.name || "друг"}!
            </h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Выйти из аккаунта
            </button>
          </div>
          <div className="space-y-16">
            <ProfileSection />
            {isTrainer ? (
              // 👈 Секции для тренера
              <TrainerBookingsSection />
            ) : (
              // 👈 Секции для клиента
              <>
                <MembershipsSection />
                <BookingsSection />
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}