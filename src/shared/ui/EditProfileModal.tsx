"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function EditProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, loadUser } = useAuthStore();
  const isTrainer = user?.role_id === 2;
  const meta = user?.metadata || {};

  const [age, setAge] = useState(meta.age || "");
  const [level, setLevel] = useState(meta.fitness_level || "");
  const [goal, setGoal] = useState(meta.goal || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const submit = async () => {
    setLoading(true);
    try {
      await api.put("/me", {
        bio: isTrainer ? bio : undefined,
        metadata: isTrainer
          ? undefined
          : {
              age,
              fitness_level: level,
              goal,
            },
      });

      toast.success("Профиль обновлён");
      await loadUser();
      onClose();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-[#1E79AD] rounded-2xl p-6 w-full max-w-md text-white">
        <h3 className="text-xl mb-6">Редактирование профиля</h3>

        {/* КЛИЕНТ */}
        {!isTrainer && (
          <div className="space-y-4">
            <Input label="Возраст" value={age} onChange={setAge} />
            <Input label="Уровень подготовки" value={level} onChange={setLevel} />
            <Input label="Цель" value={goal} onChange={setGoal} />
          </div>
        )}

        {/* ТРЕНЕР */}
        {isTrainer && (
          <div>
            <label className="text-sm opacity-70">Биография</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 p-3 bg-black border border-white/20 rounded-lg min-h-[120px]"
            />
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/20 rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-3 bg-[#1E79AD] rounded-lg"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm opacity-70">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 p-3 bg-black border border-white/20 rounded-lg"
      />
    </div>
  );
}
