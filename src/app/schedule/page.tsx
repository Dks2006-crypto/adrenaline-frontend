'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { GroupClassListItem } from '@/features/group-classes/model/types';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import ProtectedRoute from '@/shared/ProtectedRoute';

// Интерфейс для фильтров
interface ScheduleFilters {
  search: string;
  trainer: string;
  dateFrom: string;
  dateTo: string;
  availableOnly: boolean;
}

// Интерфейс для тренеров
interface Trainer {
  id: number;
  name: string;
  last_name: string;
}

export default function SchedulePage() {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ScheduleFilters>({
    search: '',
    trainer: '',
    dateFrom: '',
    dateTo: '',
    availableOnly: false,
  });

  // Загрузка групповых занятий
  const { data: groupClasses = [], isLoading: classesLoading } = useQuery<GroupClassListItem[]>({
    queryKey: ['group-classes'],
    queryFn: () => api.get('/group-classes').then((res) => res.data),
  });

  // Загрузка тренеров для фильтра (только если есть данные)
  const { data: trainers = [] } = useQuery<Trainer[]>({
    queryKey: ['trainers'],
    queryFn: () => api.get('/users?role=trainer').then((res) => res.data),
    enabled: true, // Всегда пытаемся загрузить, но обрабатываем пустой результат
  });

  // Мутация для записи на занятие
  const bookMutation = useMutation({
    mutationFn: (classId: number) =>
      api.post('/bookings', { class_id: classId }),
    onSuccess: () => {
      toast.success('Вы успешно записались на занятие!');
      queryClient.invalidateQueries({ queryKey: ['group-classes'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Ошибка при записи на занятие';
      toast.error(message);
    },
  });

  // Фильтрация занятий
  const filteredClasses = useMemo(() => {
    return groupClasses.filter((groupClass) => {
      // Поиск по названию и описанию
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          groupClass.title.toLowerCase().includes(searchLower) ||
          groupClass.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Фильтр по тренеру (если выбран конкретный тренер)
      if (filters.trainer && groupClass.trainer?.id.toString() !== filters.trainer) {
        return false;
      }

      // Фильтр по дате начала
      if (filters.dateFrom) {
        const classDate = new Date(groupClass.starts_at);
        const filterDate = new Date(filters.dateFrom);
        if (classDate < filterDate) return false;
      }

      // Фильтр по дате окончания
      if (filters.dateTo) {
        const classDate = new Date(groupClass.starts_at);
        const filterDate = new Date(filters.dateTo);
        if (classDate > filterDate) return false;
      }

      // Фильтр только доступных
      if (filters.availableOnly && groupClass.available_slots === 0) {
        return false;
      }

      return true;
    });
  }, [groupClasses, filters, trainers]);

  const handleBookClass = (classId: number) => {
    if (!token) {
      toast.error('Необходимо войти в систему');
      return;
    }
    bookMutation.mutate(classId);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      trainer: '',
      dateFrom: '',
      dateTo: '',
      availableOnly: false,
    });
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div>Загрузка...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#262626] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Заголовок */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Link
                href="/dashboard"
                className="text-[#1E79AD] hover:text-[#145073] transition-colors text-sm sm:text-base"
              >
                ← Назад в личный кабинет
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4">
              Расписание групповых тренировок
            </h1>
            <p className="text-white/70 text-sm sm:text-base lg:text-lg">
              Выберите удобное время и запишитесь на тренировку
            </p>
          </div>

          {/* Фильтры */}
          <div className="bg-black/70 backdrop-blur border-2 border-[#1E79AD] rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Фильтры</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Поиск */}
              <div>
                <label className="block text-white/70 text-xs sm:text-sm font-medium mb-2">
                  Поиск
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Название занятия..."
                  className="w-full bg-black/50 border border-[#1E79AD]/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#1E79AD] transition-colors text-sm"
                />
              </div>

              {/* Тренер */}
              <div>
                <label className="block text-white/70 text-xs sm:text-sm font-medium mb-2">
                  Тренер
                </label>
                <select
                  value={filters.trainer}
                  onChange={(e) => setFilters({ ...filters, trainer: e.target.value })}
                  className="w-full bg-black/50 border border-[#1E79AD]/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#1E79AD] transition-colors text-sm"
                  disabled={trainers.length === 0}
                >
                  <option value="">
                    {trainers.length === 0 ? 'Тренеры не найдены' : 'Все тренеры'}
                  </option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id.toString()}>
                      {trainer.name} {trainer.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Дата от */}
              <div>
                <label className="block text-white/70 text-xs sm:text-sm font-medium mb-2">
                  Дата от
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full bg-black/50 border border-[#1E79AD]/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#1E79AD] transition-colors text-sm"
                />
              </div>

              {/* Дата до */}
              <div>
                <label className="block text-white/70 text-xs sm:text-sm font-medium mb-2">
                  Дата до
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full bg-black/50 border border-[#1E79AD]/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#1E79AD] transition-colors text-sm"
                />
              </div>

              {/* Только доступные */}
              <div className="flex items-center sm:col-span-2 lg:col-span-1">
                <input
                  type="checkbox"
                  id="availableOnly"
                  checked={filters.availableOnly}
                  onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E79AD] bg-black/50 border-[#1E79AD]/30 rounded focus:ring-[#1E79AD] focus:ring-2"
                />
                <label htmlFor="availableOnly" className="ml-2 sm:ml-3 text-white/70 text-xs sm:text-sm">
                  Только доступные
                </label>
              </div>
            </div>

            {/* Кнопки управления фильтрами */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Сбросить фильтры
              </button>
              <div className="text-white/70 flex items-center text-xs sm:text-sm">
                Найдено занятий: <span className="font-bold text-[#1E79AD] ml-2">{filteredClasses.length}</span>
              </div>
            </div>
          </div>

          {/* Список занятий */}
          {classesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#1E79AD] mx-auto mb-4"></div>
              <p className="text-white/70 text-sm sm:text-base">Загрузка расписания...</p>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-white/50 text-4xl sm:text-6xl mb-4">📅</div>
              <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">Занятия не найдены</h3>
              <p className="text-white/60 text-sm sm:text-base">
                {groupClasses.length === 0
                  ? 'В настоящее время групповые занятия недоступны'
                  : 'Попробуйте изменить параметры фильтра'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredClasses.map((groupClass) => {
                const date = new Date(groupClass.starts_at);
                const timeStart = date.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const timeEnd = new Date(groupClass.ends_at).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={groupClass.id}
                    className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur border border-[#1E79AD]/30 rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:border-[#1E79AD]/60 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Заголовок */}
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight pr-2">
                        {groupClass.title}
                      </h3>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        groupClass.available_slots > 0
                          ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                          : 'bg-red-500/20 text-red-300 border border-red-400/50'
                      }`}>
                        {groupClass.available_slots > 0 ? 'Доступно' : 'Нет мест'}
                      </span>
                    </div>

                    {/* Информация */}
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-white/60 mb-1 sm:mb-0">Дата и время:</span>
                        <span className="font-medium text-white text-right sm:text-left">
                          {date.toLocaleDateString("ru-RU")} в {timeStart}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-white/60 mb-1 sm:mb-0">Продолжительность:</span>
                        <span className="font-medium text-right sm:text-left">{timeStart} – {timeEnd}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-white/60 mb-1 sm:mb-0">Свободно мест:</span>
                        <span className={`font-bold text-right sm:text-left ${
                          groupClass.available_slots <= 3 ? "text-red-400" : "text-green-400"
                        }`}>
                          {groupClass.available_slots}
                        </span>
                      </div>

                      {groupClass.trainer && (
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-white/60 mb-1 sm:mb-0">Тренер:</span>
                          <span className="font-medium text-right sm:text-left line-clamp-1">
                            {groupClass.trainer.name} {groupClass.trainer.last_name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Кнопки */}
                    <div className="flex gap-2 sm:gap-3">
                      <Link
                        href={`/group-classes/${groupClass.id}`}
                        className="flex-1 text-center bg-[#1E79AD]/20 hover:bg-[#1E79AD]/30 text-[#1E79AD] py-2.5 sm:py-3 rounded-lg font-semibold transition text-xs sm:text-sm"
                      >
                        Подробнее
                      </Link>

                      {groupClass.available_slots > 0 ? (
                        <button
                          onClick={() => handleBookClass(groupClass.id)}
                          disabled={bookMutation.isPending}
                          className="flex-1 text-center bg-[#1E79AD] hover:bg-[#145073] disabled:bg-[#1E79AD]/50 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition text-xs sm:text-sm"
                        >
                          {bookMutation.isPending ? 'Запись...' : 'Записаться'}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 text-center bg-gray-700 text-gray-500 py-2.5 sm:py-3 rounded-lg cursor-not-allowed font-medium text-xs sm:text-sm"
                        >
                          Нет мест
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}