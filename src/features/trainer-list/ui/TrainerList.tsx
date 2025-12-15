"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import React from "react";

import TrainerCard from "./TrainerCard";
import { useTrainerList } from "../lib/hooks/useTrainerList";
import { TrainerListProps } from './types';

export default function TrainerList({ onBook }: TrainerListProps) {
  const { trainers, loading } = useTrainerList();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = React.useRef<any>(null);
  const [activeGroupIndex, setActiveGroupIndex] = React.useState(0);
  const [currentSlidesPerView, setCurrentSlidesPerView] = React.useState(1);

  // Функция для определения количества видимых слайдов по ширине экрана
  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 1;
    
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    if (width >= 640) return 1.3;
    return 1;
  };

  // Обновление количества видимых слайдов при изменении размера экрана
  React.useEffect(() => {
    const updateSlidesPerView = () => {
      const slides = getSlidesPerView();
      setCurrentSlidesPerView(slides);
      
      // Пересчитываем активную группу при изменении размера
      if (swiperRef.current?.swiper) {
        const currentSlide = swiperRef.current.swiper.realIndex;
        const newGroupIndex = Math.floor(currentSlide / Math.floor(slides));
        setActiveGroupIndex(newGroupIndex);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  // Вычисляем количество групп
  const totalGroups = Math.ceil(trainers.length / Math.floor(currentSlidesPerView));

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
    <div className="relative">
      <Swiper
        ref={swiperRef}
        spaceBetween={32}
        onSlideChange={(swiper) => {
          const groupIndex = Math.floor(swiper.realIndex / Math.floor(currentSlidesPerView));
          setActiveGroupIndex(groupIndex);
        }}
        onSwiper={(swiper) => {
          // Инициализация группы при инициализации Swiper
          const groupIndex = Math.floor(swiper.realIndex / Math.floor(currentSlidesPerView));
          setActiveGroupIndex(groupIndex);
        }}
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
      
      {/* Кастомные кнопки навигации с индикаторами */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          className="w-12 h-12 bg-[#1E79AD] hover:bg-[#156a8a] text-white rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:-translate-y-1"
        >
          ←
        </button>
        
        {/* Индикаторы групп слайдов */}
        <div className="flex gap-2">
          {Array.from({ length: totalGroups }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                const slideIndex = index * Math.floor(currentSlidesPerView);
                swiperRef.current?.swiper.slideTo(slideIndex);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeGroupIndex
                  ? 'bg-[#1E79AD] scale-110'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
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