"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import MembershipsSection from "./sections/MembershipsSection";
import BookingsSection from "./sections/BookingsSection";
import ProfileSection from "./sections/ProfileSections";

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

          {/* Все секции */}
          <div className="space-y-16">
            <MembershipsSection />
            <BookingsSection />
            <ProfileSection />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}