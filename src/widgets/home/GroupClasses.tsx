"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { GroupClassList } from "@/features/group-classes";
import { useGroupClasses } from "@/features/group-classes/lib/hooks/useGroupClasses";

export default function GroupClasses() {
  const { token } = useAuthStore();
  const { groupClasses, loading } = useGroupClasses();

  return (
    <section className="py-16 bg-gray-950" id="group-classes">
      <div className="max-w-7xl mx-auto px-6">
        {/* Простой заголовок */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Групповые занятия
          </h2>
          <p className="text-gray-400 text-lg">
            Тренируйтесь вместе с другими
          </p>
        </div>

        {/* Список занятий */}
        <GroupClassList
          groupClasses={groupClasses}
          loading={loading}
        />
      </div>
    </section>
  );
}
