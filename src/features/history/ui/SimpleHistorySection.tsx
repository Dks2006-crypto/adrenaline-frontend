"use client";

import { useAuthStore } from "@/store/authStore";
import { useClientHistory, useTrainerHistory } from "../lib/hooks/useHistory";
import { useState } from "react";

export function SimpleHistorySection() {
  const { user } = useAuthStore();
  const isTrainer = user?.role_id === 2;
  const [showAll, setShowAll] = useState(false);

  const { data: clientHistory = [], isLoading: clientLoading } = useClientHistory(
    user?.id,
    {}
  );
  
  const { data: trainerHistory = [], isLoading: trainerLoading } = useTrainerHistory(
    user?.id
  );

  const history = isTrainer ? trainerHistory : clientHistory;
  const isLoading = isTrainer ? trainerLoading : clientLoading;

  const displayedHistory = showAll ? history : history.slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E79AD] mx-auto"></div>
          <p className="text-white/70 mt-2">Загрузка истории...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {isTrainer ? "История проведенных занятий" : "Моя история занятий"}
          </h3>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-white/60">
              {isTrainer ? "Пока нет проведенных занятий" : "Пока нет завершенных занятий"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedHistory.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#0b0b0b] border border-white/5 rounded-xl p-4 hover:border-[#1E79AD]/30 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.status === 'completed' ? 'bg-green-400' :
                        entry.status === 'cancelled' ? 'bg-red-400' :
                        entry.status === 'no_show' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <h4 className="text-white font-medium">{entry.training_description}</h4>
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(entry.created_at).toLocaleDateString("ru-RU")}
                      {entry.trainer && !isTrainer && (
                        <span> • с {entry.trainer.name}</span>
                      )}
                      {entry.note && (
                        <div className="mt-1 text-xs text-white/40">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      entry.status === 'completed' ? 'bg-green-900/50 text-green-300' :
                      entry.status === 'cancelled' ? 'bg-red-900/50 text-red-300' :
                      entry.status === 'no_show' ? 'bg-yellow-900/50 text-yellow-300' : 
                      'bg-blue-900/50 text-blue-300'
                    }`}>
                      {entry.status === 'completed' ? 'Завершено' :
                       entry.status === 'cancelled' ? 'Отменено' :
                       entry.status === 'no_show' ? 'Пропущено' : entry.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {history.length > 3 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-[#1E79AD] hover:text-white transition text-sm font-medium"
                >
                  {showAll ? "Скрыть" : `Показать все (${history.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}