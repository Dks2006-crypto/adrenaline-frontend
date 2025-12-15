"use client";

import { useState } from "react";
import Link from "next/link";
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

        {/* Кнопка "Все тренеры" */}
        <div className="flex justify-center mt-12">
          <Link
            href="/trainers"
            className="
              inline-flex items-center justify-center
              px-8 py-4
              bg-[#1E79AD] hover:bg-[#145073]
              text-white font-semibold
              rounded-xl transition-all duration-300
              shadow-lg hover:shadow-xl
              transform hover:scale-105
            "
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Все тренеры
          </Link>
        </div>

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