"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Интерфейс для данных о подписке (Membership)
interface Membership {
    id: number;
    status: 'active' | 'expired' | 'frozen' | 'pending';
    remaining_visits: number | null; // <-- Поле для посещений
    start_date: string;
    end_date: string; // <-- Поле для даты окончания
    service: {
        title: string;
    } | null;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":   
      return { 
        text: "Активна", 
        color: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50",
        glowColor: "shadow-emerald-500/20"
      };
    case "expired":  
      return { 
        text: "Истёк", 
        color: "bg-red-500/20 text-red-300 border-red-400/50",
        glowColor: "shadow-red-500/20"
      };
    case "frozen":   
      return { 
        text: "Заморожена", 
        color: "bg-amber-500/20 text-amber-300 border-amber-400/50",
        glowColor: "shadow-amber-500/20"
      };
    case "pending":  
      return { 
        text: "В ожидании", 
        color: "bg-blue-500/20 text-blue-300 border-blue-400/50",
        glowColor: "shadow-blue-500/20"
      };
    default:         
      return { 
        text: status, 
        color: "bg-gray-500/20 text-gray-300 border-gray-400/50",
        glowColor: "shadow-gray-500/20"
      };
  }
};

export default function MembershipsSection() {
  const { data: memberships = [], isLoading } = useQuery<Membership[]>({
    queryKey: ["memberships"],
    queryFn: () => api.get("/memberships").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section className="flex justify-center py-20">
        <div className="w-full max-w-4xl border-2 border-[#1E79AD] rounded-2xl p-8 text-white relative bg-black/70 backdrop-blur">
          <h2 className="text-center text-xl mb-10 opacity-90">Мои абонементы</h2>
          <div className="text-center py-12 text-white/70">Загрузка абонементов...</div>
        </div>
      </section>
    );
  }

  const activeMemberships = memberships.filter(m => m.status === 'active' || m.status === 'frozen' || m.status === 'pending');
  const expiredMemberships = memberships.filter(m => m.status === 'expired');

  return (
    <section className="flex justify-center py-20">
      <div className="w-full max-w-6xl border-2 border-[#1E79AD] rounded-2xl p-8 text-white relative bg-black/70 backdrop-blur">
        <h2 className="text-xl mb-10 opacity-90">Мои абонементы</h2>
        
        {activeMemberships.length === 0 && expiredMemberships.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#1E79AD]/10 to-purple-600/10 border border-[#1E79AD]/30 rounded-2xl">
            <div className="text-white/90 text-lg mb-2">У вас пока нет абонементов</div>
            <div className="text-white/60">Купите первый на главной странице!</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Активные, замороженные и ожидающие */}
            {activeMemberships.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white/80 mb-6">Активные абонементы</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeMemberships.map((m) => {
                    const status = getStatusConfig(m.status);
                    return (
                      <div 
                        key={m.id}
                        className={`bg-gradient-to-br from-black/60 to-black/40 backdrop-blur border border-[#1E79AD]/30 rounded-2xl p-6 hover:shadow-2xl hover:border-[#1E79AD]/60 transition-all duration-300 transform hover:-translate-y-1 ${status.glowColor}`}
                      >
                        <h4 className="text-lg font-bold text-white mb-4 leading-tight">
                          {m.service?.title || "Абонемент"}
                        </h4>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Статус:</span>
                            <span className={`px-3 py-1 rounded-full font-medium text-sm border ${status.color}`}>
                              {status.text}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-white/70">Осталось посещений:</span>
                            <span className="font-semibold text-white">
                              {m.remaining_visits !== null ? m.remaining_visits : "Безлимит"} 
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-white/70">Действует до:</span>
                            <span className="font-semibold text-white">
                              {m.end_date ? new Date(m.end_date).toLocaleDateString("ru-RU") : "—"}
                            </span>
                          </div>

                          {/* Прогресс-бар для визуализации */}
                          {m.remaining_visits !== null && (
                            <div className="pt-3 border-t border-[#1E79AD]/30">
                              <div className="flex justify-between text-xs text-white/60 mb-2">
                                <span>Использовано</span>
                                <span>{Math.max(0, (m.remaining_visits || 0) - (m.remaining_visits || 0))} / {m.remaining_visits}</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-[#1E79AD] to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.max(0, 100 - ((m.remaining_visits || 0) / (m.remaining_visits || 1)) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Истекшие (в скрываемом блоке) */}
            {expiredMemberships.length > 0 && (
              <details className="border-t border-[#1E79AD]/30 pt-6">
                <summary className="text-lg font-semibold text-white/80 cursor-pointer hover:text-white transition-colors">
                  Показать истекшие абонементы ({expiredMemberships.length})
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {expiredMemberships.map((m) => (
                    <div 
                      key={m.id}
                      className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 backdrop-blur border border-gray-600/30 rounded-2xl p-6 opacity-75 hover:opacity-90 transition-opacity"
                    >
                      <h4 className="text-lg font-bold text-gray-300 mb-4">
                        {m.service?.title || "Абонемент"} (Истёк)
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-400">
                          Действовал до: {m.end_date ? new Date(m.end_date).toLocaleDateString("ru-RU") : "—"}
                        </p>
                        <p className="text-gray-500">
                          Осталось посещений: {m.remaining_visits !== null ? m.remaining_visits : "Безлимит"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </section>
  );
}