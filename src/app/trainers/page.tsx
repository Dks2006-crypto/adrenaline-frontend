"use client";

import { useState, useMemo } from "react";
import TrainerCard from "@/features/trainer-list/ui/TrainerCard";
import { useTrainerList } from "@/features/trainer-list/lib/hooks/useTrainerList";
import BookingModal from "@/shared/ui/BookingModal";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function TrainersPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [bookingsFilter, setBookingsFilter] = useState<"all" | "accepts" | "not_accepts">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const { token } = useAuthStore();
  const { trainers, loading } = useTrainerList();

  // Получаем уникальные специализации
  const uniqueSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>();
    trainers.forEach((trainer) => {
      if (trainer.specialties && Array.isArray(trainer.specialties)) {
        trainer.specialties.forEach((specialty) => specialtiesSet.add(specialty));
      }
    });
    return Array.from(specialtiesSet).sort();
  }, [trainers]);

  // Фильтруем тренеров по выбранной специализации и статусу заявок
  const filteredTrainers = useMemo(() => {
    let filtered = trainers;

    // Фильтр по специализации
    if (selectedSpecialty) {
      filtered = filtered.filter((trainer) => {
        if (!trainer.specialties || !Array.isArray(trainer.specialties)) return false;
        return trainer.specialties.includes(selectedSpecialty);
      });
    }

    // Фильтр по статусу заявок (только принимающих)
    if (bookingsFilter === "accepts") {
      filtered = filtered.filter((trainer) => {
        const acceptsBookings = trainer.accepts_personal_bookings ?? true;
        return acceptsBookings;
      });
    }

    return filtered;
  }, [trainers, selectedSpecialty, bookingsFilter]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#121212] border border-white/10 rounded-2xl p-8 animate-pulse"
              >
                <div className="w-full h-64 bg-white/10 rounded-2xl mb-6"></div>
                <div className="h-8 bg-white/10 rounded mx-auto w-48 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <div className="mb-12 text-center">
          <span className="inline-block bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
            НАШИ ТРЕНЕРЫ
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Все наши <span className="text-[#1E79AD]">профессионалы</span>
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            Выберите специализацию, чтобы найти тренера, который поможет достичь ваших целей
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button
              onClick={() => setSelectedSpecialty("")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                !selectedSpecialty
                  ? "bg-[#1E79AD] text-white shadow-lg"
                  : "bg-[#2b2b2b] text-white/70 hover:bg-[#1E79AD] hover:text-white"
              }`}
            >
              Все специализации
            </button>
            {uniqueSpecialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedSpecialty === specialty
                    ? "bg-[#1E79AD] text-white shadow-lg"
                    : "bg-[#2b2b2b] text-white/70 hover:bg-[#1E79AD] hover:text-white"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
          
          {/* Переключатель заявок */}
          <div className="flex justify-center">
            <button
              onClick={() => setBookingsFilter(bookingsFilter === "accepts" ? "all" : "accepts")}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                bookingsFilter === "accepts"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-[#2b2b2b] text-white/70 hover:bg-green-600 hover:text-white"
              }`}
            >
              {bookingsFilter === "accepts" ? "✓ Только доступные" : "Показать только доступных"}
            </button>
          </div>
        </div>

        {/* Результаты */}
        <div className="mb-8">
          <p className="text-white/70 text-center">
            Найдено {filteredTrainers.length} {filteredTrainers.length === 1 ? 'тренер' : filteredTrainers.length < 5 ? 'тренера' : 'тренеров'}
            {selectedSpecialty && ` по специализации "${selectedSpecialty}"`}
            {bookingsFilter === "accepts" && ", принимающих заявки"}
          </p>
        </div>

        {/* Список тренеров */}
        {filteredTrainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onBook={handleBookClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/70 text-xl">
              {selectedSpecialty
                ? `Нет тренеров по специализации "${selectedSpecialty}"${bookingsFilter === "accepts" ? " принимающих заявки" : ""}`
                : bookingsFilter === "accepts"
                ? "Нет тренеров, принимающих заявки"
                : "Тренеры временно недоступны"
              }
            </p>
          </div>
        )}

        {/* Модалка записи */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBookingSuccess}
          trainerId={selectedTrainerId}
          classId={null}
        />
      </div>
    </div>
  );
}