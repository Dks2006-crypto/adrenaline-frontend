"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/shared/ProtectedRoute";
import ProfileSection from "./sections/ProfileSections";
import TrainerBookingsSection from "./sections/trainer/TrainerBookingSection";
import MembershipsSection from "./sections/user/MembershipsSection";
import BookingsSection from "./sections/user/BookingsSection";
import { useState } from "react";
import SidebarMenu from "@/shared/ui/SidebarMenu";
import HistorySection from "./sections/HistorySection";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const isTrainer = user?.role_id === 2;
  const isAdmin = user?.role_id === 1;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const contentShiftClass = isMenuOpen ? 'md:ml-64' : 'md:ml-0';

  const handleLogout = () => {
    logout();
    router.push("/");
  };


  return (
    <ProtectedRoute>

      <button
        onClick={toggleMenu}
        className={`fixed top-1/2 -translate-y-[250px] z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 shadow-lg transition-all duration-300 transform
          ${isMenuOpen ? `left-64 rounded-tr-xl rounded-br-none` : 'left-0 rounded-r-xl'}
        `}
        aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
        </svg>
      </button>

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        logout={handleLogout}
      />

      <div className="min-h-screen bg-[#262626]">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Шапка */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Привет, {user?.name || "друг"}!
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transition transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
            >
              Выйти из аккаунта
            </button>
          </div>
          <div className="space-y-12 sm:space-y-16">
            <div id="profile">
              <ProfileSection />
            </div>
            {isAdmin ? (
              null
            ) : isTrainer ? (
              <>
                <div id="bookings">
                  <TrainerBookingsSection />
                </div>
                <div id="history">
                  <HistorySection />
                </div>
              </>
            ) : (
              <>
                <div id="memberships">
                  <MembershipsSection />
                </div>
                <div id="bookings">
                  <BookingsSection />
                </div>
                <div id="history">
                  <HistorySection />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
