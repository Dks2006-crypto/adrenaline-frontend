import Image from "next/image";
import { useState } from "react";
import { Trainer } from "@/entities/trainer";

interface TrainerCardProps {
  trainer: Trainer;
  onBook: (trainerId: number) => void;
}

export default function TrainerCard({ trainer, onBook }: TrainerCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = trainer.avatar_url && !imageError;

  /* V-декорация — показываем только если нет фото */
  const VDecor = () => (
    <div className="flex justify-center items-center w-full h-full relative">
      {/* Белая перевёрнутая V сзади */}
      <svg className="absolute w-64 h-64 opacity-45" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M 22 78 L 50 28 L 78 78" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {/* Синяя нормальная V спереди */}
      <svg className="absolute w-64 h-64" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M 20 22 L 50 80 L 80 22" fill="none" stroke="#1E79AD" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );

  return (
    <div className="
      bg-[#121212]
      border border-white/10
      rounded-2xl
      overflow-hidden
      flex flex-col
      h-full
      hover:border-[#1E79AD]
      hover:shadow-2xl
      transition-all duration-300
      group
    ">
      {/* Блок с фото или V-декорацией */}
      <div className="relative w-full h-80 bg-black/40">
        {hasImage ? (
          <>
            <Image
              src={trainer.avatar_url!}
              alt={`${trainer.name} ${trainer.last_name || ""}`}
              fill
              className="object-cover transition-transform duration-500"
              unoptimized
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </>
        ) : (
          /* Если нет фото — показываем V-декорацию */
          <div className="flex items-center justify-center h-full">
            <VDecor />
            {/* Опционально: иконка или инициалы */}
            <div className="absolute text-6xl font-bold text-white/30 tracking-wider">
              {trainer.name.charAt(0)}{trainer.last_name?.charAt(0) || ""}
            </div>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-white text-center mb-4">
          {trainer.name} {trainer.last_name || ""}
        </h3>

        {trainer.specialties && (
          <p className="text-[#1E79AD] text-sm font-medium text-center mb-3">
            {trainer.specialties}
          </p>
        )}

        <p className="text-white/80 text-sm leading-relaxed flex-1 text-center">
          {trainer.bio || "Профессиональный тренер с большим опытом. Готов помочь достичь ваших целей."}
        </p>

        {/* Кнопка */}
        <button
          onClick={() => onBook(trainer.id)}
          className="mt-8 bg-[#1E79AD] hover:bg-[#145073] text-white font-semibold py-3.5 rounded-xl transition shadow-lg"
        >
          Записаться на тренировку
        </button>
      </div>
    </div>
  );
}