"use client";

import { useState } from "react";
import BookingModal from "@/shared/ui/BookingModal";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { TrainerList } from "@/features/trainer-list";

export const TrainersWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const { token } = useAuthStore();

  const handleBookClick = (trainerId: number) => {
    if (!token) {
      toast.error("Для записи необходимо войти в систему.");
      return;
    }
    setSelectedTrainerId(trainerId);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    setSelectedTrainerId(null);
    toast.success("Заявка отправлена! Тренер свяжется с вами в ближайшее время.");
  };

  /* V-декорация — как в тарифах и групповых занятиях */
  const VDecor = () => (
    <div className="flex justify-center items-center mb-8 w-32 h-32 relative mx-auto">
      <svg className="absolute w-52 h-52 opacity-45" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M 22 78 L 50 28 L 78 78" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg className="absolute w-52 h-52" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M 20 22 L 50 80 L 80 22" fill="none" stroke="#1E79AD" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );

  return (
    <section className="py-24 bg-[#111111]" id="trainers">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <div className="mb-16 text-start">
          <span className="inline-block bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
            НАШИ ТРЕНЕРЫ
          </span>
          <h2 className="mt-6 text-center text-4xl md:text-5xl font-bold text-white">
            Профессионалы, которые помогут достичь <span className="text-[#1E79AD]">ваших целей</span>
          </h2>
        </div>

        {/* Список тренеров */}
        <TrainerList onBook={handleBookClick} />

        {/* Модалка записи */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBookingSuccess}
          trainerId={selectedTrainerId}
          classId={null}
        />
      </div>
    </section>
  );
};