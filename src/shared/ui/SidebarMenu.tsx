import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, logout }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const isTrainer = user?.role_id === 2;
  const isAdmin = user?.role_id === 1;

  // Определяем пункты меню в зависимости от роли пользователя
  const getMenuItems = () => {
    if (isAdmin) {
      return [
        {
          name: "Расписание",
          action: () => {
            router.push('/schedule');
            onClose();
          }
        },
        {
          name: "Админ-панель",
          action: () => {
            router.push('/admin');
            onClose();
          }
        },
        {
          name: "Профиль",
          action: () => {
            router.push('/dashboard#profile');
            onClose();
          }
        },
      ];
    } else if (isTrainer) {
      return [
        {
          name: "Расписание",
          action: () => {
            router.push('/schedule');
            onClose();
          }
        },
        {
          name: "История",
          action: () => {
            router.push('/dashboard#history');
            onClose();
          }
        },
        {
          name: "Управление заявками",
          action: () => {
            router.push('/dashboard#bookings');
            onClose();
          }
        },
        {
          name: "Профиль",
          action: () => {
            router.push('/dashboard#profile');
            onClose();
          }
        },
      ];
    } else {
      return [
        {
          name: "Расписание",
          action: () => {
            router.push('/schedule');
            onClose();
          }
        },
        {
          name: "История",
          action: () => {
            router.push('/dashboard#history');
            onClose();
          }
        },
        {
          name: "Мои записи",
          action: () => {
            router.push('/dashboard#bookings');
            onClose();
          }
        },
        {
          name: "Мои абонементы",
          action: () => {
            router.push('/dashboard#memberships');
            onClose();
          }
        },
        {
          name: "Профиль",
          action: () => {
            router.push('/dashboard#profile');
            onClose();
          }
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    // Позиционирование: Центрирование по вертикали, фиксированная высота.
    <div
      className={`fixed top-1/2 -translate-y-1/2 left-0 w-64 h-[500px] bg-[#1a1a1a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-br-xl overflow-hidden ${
        isOpen ? "translate-x-0" : "translate-x-[-100%]"
      }`}
    >
      <div className="flex flex-col h-full text-white">
        
        {/* Синий заголовок: продолжение кнопки */}
        <div className="bg-blue-600 px-6 py-4 font-bold text-lg shadow-md">
            Меню профиля
        </div>

        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            className="py-3 px-6 cursor-pointer border-b border-gray-800 hover:bg-gray-800 flex justify-between items-center transition-colors"
          >
            {item.name}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        ))}
        
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="mt-auto mx-6 mb-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;