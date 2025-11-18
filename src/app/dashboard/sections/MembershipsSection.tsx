"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

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
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => api.get("/memberships").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Мои подписки</h2>
        <div className="text-center py-12 text-gray-500">Загрузка подписок...</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Мои подписки</h2>

      {memberships.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-200">
          <p className="text-xl text-gray-600">У вас пока нет активных подписок</p>
          <p className="text-gray-500 mt-2">Приобретите абонемент в разделе "Тарифы"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memberships.map((m: any) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {m.service?.title || "Подписка"}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span className={`px-3 py-1 rounded-full font-medium text-sm border ${getStatusColor(m.status)}`}>
                    {m.status === "active" ? "Активна" :
                     m.status === "expired" ? "Истёк" :
                     m.status === "frozen" ? "Заморожена" : m.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Осталось посещений:</span>
                  <span className="font-medium">
                    {m.remaining_visits !== null ? m.remaining_visits : "Безлимит"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Действует до:</span>
                  <span className="font-medium">
                    {m.expires_at ? new Date(m.expires_at).toLocaleDateString("ru-RU") : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}