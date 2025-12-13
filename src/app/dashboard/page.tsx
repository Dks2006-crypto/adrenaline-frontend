"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/shared/ProtectedRoute";
import ProfileSection from "./sections/ProfileSections";
import TrainerBookingsSection from "./sections/trainer/TrainerBookingSection";
import MembershipsSection from "./sections/user/MembershipsSection";
import BookingsSection from "./sections/user/BookingsSection";
import { useState } from "react";
import SidebarMenu from "@/shared/ui/SidebarMenu";


export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const isTrainer = user?.role_id === 2;


  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const contentShiftClass = isMenuOpen ? 'md:ml-64' : 'md:ml-0';


  return (
    <ProtectedRoute>

      <button
        onClick={toggleMenu}
        // Изменено: top-1/2 - translate-y-1/2 убрано. Теперь top-1/2 - translate-y-[250px]
        // top-1/2 - translate-y-[250px] это верхний край h-[500px] сайдбара.
        className={`fixed top-1/2 -translate-y-[250px] z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 shadow-lg transition-all duration-300 transform 
          ${isMenuOpen ? `left-64 rounded-tr-xl rounded-br-none` : 'left-0 rounded-r-xl'}
        `}
        aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        // Важно: Когда сайдбар открыт, кнопка должна быть БЕЗ закругления со стороны сайдбара
      >
        {/* Иконка стрелочки, меняющая направление */}
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Используем иконку, которая кажется "ручкой" или вкладкой */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Вставляем компонент меню */}
      <SidebarMenu 
        isOpen={isMenuOpen} 
        onClose={closeMenu} 
        logout={logout} 
      />

      <div className="min-h-screen bg-[#262626]">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
          {/* Шапка */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
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
