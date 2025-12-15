"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { GroupClassList } from "@/features/group-classes";
import { useGroupClasses } from "@/features/group-classes/lib/hooks/useGroupClasses";

export default function GroupClasses() {
  const { token } = useAuthStore();
  const { groupClasses, loading } = useGroupClasses();

  return (
    <section className="py-24 bg-[#0b0b0b]" id="group-classes">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <div className="mb-16 text-start">
          <span className="inline-block bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
            ГРУППОВЫЕ ЗАНЯТИЯ
          </span>
          <h2 className="mt-6 text-center text-4xl md:text-5xl font-bold text-white">
            Тренируйтесь в <span className="text-[#1E79AD]">команде</span>
          </h2>
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
