"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import TrainerCard from "./TrainerCard";
import { useTrainerList } from "../lib/hooks/useTrainerList";
import { TrainerListProps } from './types';

export default function TrainerList({ onBook }: TrainerListProps) {
  const { trainers, loading } = useTrainerList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
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
    );
  }

  if (!trainers || trainers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/70 text-xl">Тренеры временно недоступны</p>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={32}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1.3, centeredSlides: true },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-12"
    >
      {trainers.map((trainer) => (
        <SwiperSlide key={trainer.id}>
          <TrainerCard trainer={trainer} onBook={onBook} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}