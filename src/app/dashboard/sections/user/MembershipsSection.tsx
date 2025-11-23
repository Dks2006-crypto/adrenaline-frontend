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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":   return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "expired":  return "bg-red-100 text-red-800 border-red-200";
    case "frozen":   return "bg-amber-100 text-amber-800 border-amber-200";
    case "pending":  return "bg-blue-100 text-blue-800 border-blue-200";
    default:         return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function MembershipsSection() {
  const { data: memberships = [], isLoading } = useQuery<Membership[]>({
    queryKey: ["memberships"],
    queryFn: () => api.get("/memberships").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Мои абонементы</h2>
        <div className="text-center py-12 text-gray-700">Загрузка абонементов...</div>
      </section>
    );
  }

  const activeMemberships = memberships.filter(m => m.status === 'active' || m.status === 'frozen' || m.status === 'pending');
  const expiredMemberships = memberships.filter(m => m.status === 'expired');

  return (
    <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Мои абонементы</h2>
        
        {activeMemberships.length === 0 && expiredMemberships.length === 0 ? (
             <div className="text-gray-700 py-6 border-l-4 border-gray-200 bg-gray-50 p-4 rounded-xl">
                 У вас пока нет абонементов. Купите первый на главной странице!
             </div>
        ) : (
            <div className="space-y-8">
                {/* Активные, замороженные и ожидающие */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeMemberships.map((m) => (
                        <div 
                            key={m.id}
                            className="bg-white rounded-2xl shadow-lg border-t-4 border-blue-500 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {m.service?.title || "Абонемент"}
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                <span className="text-gray-700">Статус:</span>
                                <span className={`px-3 py-1 rounded-full font-medium text-sm border ${getStatusColor(m.status)}`}>
                                    {m.status === "active" ? "Активна" :
                                    m.status === "expired" ? "Истёк" :
                                    m.status === "frozen" ? "Заморожена" : "В ожидании"}
                                </span>
                                </div>

                                <div className="flex justify-between">
                                <span className="text-gray-700">Осталось посещений:</span>
                                <span className="font-medium text-gray-900">
                                    {/* 🚨 ИСПРАВЛЕНИЕ 1: Используем remaining_visits */}
                                    {m.remaining_visits !== null ? m.remaining_visits : "Безлимит"} 
                                </span>
                                </div>

                                <div className="flex justify-between">
                                <span className="text-gray-700">Действует до:</span>
                                <span className="font-medium text-gray-900">
                                    {/* 🚨 ИСПРАВЛЕНИЕ 2: Используем end_date */}
                                    {m.end_date ? new Date(m.end_date).toLocaleDateString("ru-RU") : "—"}
                                </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Истекшие (в скрываемом блоке) */}
                {expiredMemberships.length > 0 && (
                    <details className="mt-8 border-t pt-4">
                        <summary className="text-lg font-semibold text-gray-700 cursor-pointer">
                            Показать истекшие абонементы ({expiredMemberships.length})
                        </summary>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            {expiredMemberships.map((m) => (
                                <div 
                                    key={m.id}
                                    className="bg-gray-50 rounded-2xl shadow-sm border p-6 opacity-70"
                                >
                                     <h3 className="text-xl font-bold text-gray-700 mb-4">
                                        {m.service?.title || "Абонемент"} (Истёк)
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        Действовал до: {m.end_date ? new Date(m.end_date).toLocaleDateString("ru-RU") : "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        )}
    </section>
  );
}