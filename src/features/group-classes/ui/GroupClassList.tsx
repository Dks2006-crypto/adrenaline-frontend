"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import GroupClassCard from "./GroupClassCard";
import { GroupClassListProps } from './types';

export default function GroupClassList({ groupClasses, loading }: GroupClassListProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = React.useRef<any>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#121212] border border-white/10 rounded-2xl p-8 animate-pulse"
          >
            <div className="h-32 bg-white/5 rounded-full mb-6 mx-auto"></div>
            <div className="h-6 bg-white/10 rounded mx-auto w-48 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-4/5"></div>
              <div className="h-4 bg-white/10 rounded w-3/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!groupClasses || groupClasses.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/70 text-xl">Групповые занятия временно недоступны</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        modules={[Pagination]}
        spaceBetween={32}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1.3, centeredSlides: true },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-20"
      >
        {groupClasses.map((groupClass) => (
          <SwiperSlide key={groupClass.id}>
            <GroupClassCard groupClass={groupClass} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Кастомные кнопки навигации */}
      <div className="flex justify-center items-center gap-8 mt-8">
        <button
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          className="w-12 h-12 bg-[#1E79AD] hover:bg-[#156a8a] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:-translate-y-1"
        >
          ←
        </button>
        <button
          onClick={() => swiperRef.current?.swiper.slideNext()}
          className="w-12 h-12 bg-[#1E79AD] hover:bg-[#156a8a] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:-translate-y-1"
        >
          →
        </button>
      </div>
    </div>
  );
}