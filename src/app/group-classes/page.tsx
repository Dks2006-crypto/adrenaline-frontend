"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { GroupClassListItem } from "@/features/group-classes/model/types";

export default function GroupClassesPage() {
  const [groupClasses, setGroupClasses] = useState<GroupClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'upcoming'>('all');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchGroupClasses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${apiUrl}/api/group-classes`);

        if (!response.ok) {
          throw new Error('Не удалось загрузить групповые занятия');
        }

        const data = await response.json();
        setGroupClasses(data);
      } catch (error) {
        console.error('Error fetching group classes:', error);
        setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupClasses();
  }, []);

  const filteredClasses = groupClasses.filter((groupClass) => {
    if (filter === 'available') {
      return groupClass.available_slots > 0;
    }
    if (filter === 'upcoming') {
      return new Date(groupClass.starts_at) > new Date();
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-12">Групповые занятия</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-12">Групповые занятия</h1>
          <div className="bg-red-900/50 border border-red-800 rounded-xl p-6 text-red-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Групповые занятия</h1>
            <p className="text-gray-400">Присоединяйтесь к нашим групповым тренировкам с профессиональными тренерами</p>
          </div>

          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'available' | 'upcoming')}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">Все занятия</option>
              <option value="available">Только с местами</option>
              <option value="upcoming">Предстоящие</option>
            </select>

            {token && (
              <Link
                href="/dashboard"
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl font-semibold transition"
              >
                Личный кабинет
              </Link>
            )}
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
            <h2 className="text-xl font-semibold mb-2">Нет доступных занятий</h2>
            <p>Попробуйте изменить фильтры или проверьте позже</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((groupClass) => (
              <div key={groupClass.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{groupClass.title}</h3>
                  {groupClass.service && (
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      {groupClass.service.title}
                    </span>
                  )}
                </div>

                {groupClass.description && (
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {groupClass.description}
                  </p>
                )}

                <div className="flex items-center mb-4">
                  {groupClass.trainer?.avatar_url && (
                    <img
                      src={groupClass.trainer.avatar_url}
                      alt={`${groupClass.trainer.name} ${groupClass.trainer.last_name}`}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Тренер:</p>
                    <p className="text-white font-medium">
                      {groupClass.trainer ? `${groupClass.trainer.name} ${groupClass.trainer.last_name}` : 'Не назначен'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Начало:</p>
                    <p className="text-white font-medium">
                      {new Date(groupClass.starts_at).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Окончание:</p>
                    <p className="text-white font-medium">
                      {new Date(groupClass.ends_at).toLocaleString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Свободных мест:</p>
                    <p className={`text-white font-bold text-lg ${groupClass.available_slots <= 3 ? 'text-red-400' : ''}`}>
                      {groupClass.available_slots} из {groupClass.capacity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">Стоимость:</p>
                    <p className="text-white font-bold text-lg">
                      {(groupClass.price_cents / 100).toLocaleString('ru-RU')} {groupClass.currency}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/group-classes/${groupClass.id}`}
                  className="block w-full text-center bg-pink-500 hover:bg-pink-600 transition text-white px-6 py-3 rounded-xl font-semibold group-hover:bg-pink-600"
                >
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}