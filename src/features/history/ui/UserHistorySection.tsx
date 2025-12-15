"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useHistoryStats, useClientHistory } from "../lib/hooks/useHistory";
import { HistoryFilters as FilterType } from "../model/types";
import HistoryTable from "./HistoryTable";
import HistoryFilters from "./HistoryFilters";

export function UserHistorySection() {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<FilterType>({});
  
  const { data: stats, isLoading: statsLoading } = useHistoryStats();
  const { data: history = [], isLoading: historyLoading, refetch } = useClientHistory(
    user?.id,
    filters
  );

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  if (historyLoading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E79AD] mx-auto"></div>
            <p className="text-white/70 mt-4">Загрузка истории занятий...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">
            Моя история занятий
          </h2>
          <button
            onClick={() => refetch()}
            className="bg-[#1E79AD] hover:bg-[#145073] text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m10-5v5h-5m-10 6v5h5m10-5v5h-5" />
            </svg>
            Обновить
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
              <div className="text-white/60 text-sm mb-1">Всего занятий</div>
              <div className="text-3xl font-bold text-white">{stats.total_sessions}</div>
            </div>
            
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
              <div className="text-green-400 text-sm mb-1">Посещено</div>
              <div className="text-3xl font-bold text-green-400">{stats.completed_sessions}</div>
            </div>
            
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
              <div className="text-red-400 text-sm mb-1">Отменено</div>
              <div className="text-3xl font-bold text-red-400">{stats.cancelled_sessions}</div>
            </div>
            
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
              <div className="text-yellow-400 text-sm mb-1">Пропущено</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.no_show_sessions}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <HistoryFilters 
          onFiltersChange={handleFiltersChange} 
          isLoading={historyLoading}
          initialFilters={filters}
        />

        {/* History Table */}
        <HistoryTable entries={history} isTrainer={false} />
      </div>
    </section>
  );
}
