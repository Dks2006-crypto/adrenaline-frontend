"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TrainerCard from "./TrainerCard";
import { useTrainerList } from "../lib/hooks/useTrainerList";

interface TrainerListProps {
  onBook: (trainerId: number) => void;
}

export default function TrainerList({ onBook }: TrainerListProps) {
  const { trainers, loading } = useTrainerList();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!trainers || trainers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Тренеры не найдены</p>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={30}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1.2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-10"
    >
      {trainers.map((trainer) => (
        <SwiperSlide key={trainer.id}>
          <TrainerCard trainer={trainer} onBook={onBook} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
