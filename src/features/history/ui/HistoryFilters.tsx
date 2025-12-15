"use client";

import { useState, useEffect } from "react";
import { HistoryFilters as FilterType } from "../model/types";

interface HistoryFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
  isLoading?: boolean;
  initialFilters?: FilterType;
}

export default function HistoryFilters({ onFiltersChange, isLoading, initialFilters }: HistoryFiltersProps) {
  const [filters, setFilters] = useState<FilterType>({
    date_from: initialFilters?.date_from || "",
    date_to: initialFilters?.date_to || "",
    status: initialFilters?.status || "",
    type: initialFilters?.type || "",
  });

  // Синхронизация с начальными фильтрами при изменении
  useEffect(() => {
    if (initialFilters) {
      setFilters({
        date_from: initialFilters.date_from || "",
        date_to: initialFilters.date_to || "",
        status: initialFilters.status || "",
        type: initialFilters.type || "",
      });
    }
  }, [initialFilters]);

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [key]: value };
      return newFilters;
    });
  };

  // Debounce для дат (чтобы не отправлять запрос на каждый символ)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.date_from !== "" || filters.date_to !== "") {
        onFiltersChange(filters);
      }
    }, 500); // Задержка 500ms для дат

    return () => clearTimeout(timer);
  }, [filters.date_from, filters.date_to, onFiltersChange]);

  // Debounce только для статуса и типа
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.status !== "" || filters.type !== "") {
        onFiltersChange(filters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.status, filters.type, onFiltersChange]);

  const clearFilters = () => {
    const emptyFilters = {
      date_from: "",
      date_to: "",
      status: "",
      type: "",
    };
    setFilters(emptyFilters);
    // Не нужен debounce для очистки
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg">Фильтры</h3>
        <button
          onClick={clearFilters}
          className="text-[#1E79AD] hover:text-[#145073] font-medium text-sm transition"
        >
          Очистить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date From */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Дата от
          </label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange("date_from", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:border-[#1E79AD] focus:outline-none transition"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Дата до
          </label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange("date_to", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:border-[#1E79AD] focus:outline-none transition"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Статус
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#1E79AD] focus:outline-none transition"
          >
            <option value="">Все статусы</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
            <option value="no_show">Не явился</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Тип
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#1E79AD] focus:outline-none transition"
          >
            <option value="">Все типы</option>
            <option value="group">Групповые занятия</option>
            <option value="personal">Персональные тренировки</option>
          </select>
        </div>
      </div>

      {/* Active filters display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.date_from && (
          <span className="bg-[#1E79AD]/20 text-[#1E79AD] px-3 py-1 rounded-full text-xs">
            С {filters.date_from}
          </span>
        )}
        {filters.date_to && (
          <span className="bg-[#1E79AD]/20 text-[#1E79AD] px-3 py-1 rounded-full text-xs">
            По {filters.date_to}
          </span>
        )}
        {filters.status && (
          <span className="bg-[#1E79AD]/20 text-[#1E79AD] px-3 py-1 rounded-full text-xs">
            {filters.status === "completed" && "Завершено"}
            {filters.status === "cancelled" && "Отменено"}
            {filters.status === "no_show" && "Не явился"}
          </span>
        )}
        {filters.type && (
          <span className="bg-[#1E79AD]/20 text-[#1E79AD] px-3 py-1 rounded-full text-xs">
            {filters.type === "group" && "Групповые"}
            {filters.type === "personal" && "Персональные"}
          </span>
        )}
      </div>
    </div>
  );
}
