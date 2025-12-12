"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { GroupClassListItem } from "@/features/group-classes/model/types";

export default function GroupClasses() {
  const [groupClasses, setGroupClasses] = useState<GroupClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">Групповые занятия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
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
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">Групповые занятия</h2>
          <div className="bg-red-900/50 border border-red-800 rounded-xl p-6 text-red-200">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (groupClasses.length === 0) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">Групповые занятия</h2>
          <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
            В настоящее время нет доступных групповых занятий.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12">Групповые занятия</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupClasses.map((groupClass) => (
            <div key={groupClass.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition">
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

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Свободных мест:</p>
                  <p className="text-white font-bold text-lg">
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
                className="mt-6 block w-full text-center bg-pink-500 hover:bg-pink-600 transition text-white px-6 py-3 rounded-xl font-semibold"
              >
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}