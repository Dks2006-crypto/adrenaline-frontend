import Image from 'next/image';
import { Trainer } from '@/entities/trainer';

interface TrainerCardProps {
  trainer: Trainer;
  onBook: (trainerId: number) => void;
}

export const TrainerCard = ({ trainer, onBook }: TrainerCardProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition duration-300">
      {/* Аватар и имя */}
      <div className="relative h-64 w-full">
        {trainer.avatar_url ? (
          <Image
            src={trainer.avatar_url}
            alt={`${trainer.name} ${trainer.last_name || ''}`}
            fill
            className="object-cover z-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-6xl font-bold text-white">
              {trainer.name?.charAt(0).toUpperCase() || 'T'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-opacity-30 flex items-end p-6 z-10">
          <div>
            <h3 className="text-3xl bg-black py-2 px-4 rounded-full font-bold text-white leading-tight">
              {trainer.name} {trainer.last_name}
            </h3>
          </div>
        </div>
      </div>

      {/* Блок с информацией */}
      <div className="p-6 flex flex-col grow">
        {/* Специализации (теги) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {trainer.specialties && trainer.specialties.length > 0 ? (
            trainer.specialties.map((spec, index) => (
              <span
                key={index}
                className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
              >
                {spec}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">Персональный тренер</span>
          )}
        </div>

        {/* Биография (обрезаем если длинная) */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 grow">
          {trainer.bio || 'Опытный инструктор поможет вам достичь поставленных целей.'}
        </p>

        {/* Кнопка записи */}
        <button
          onClick={() => onBook(trainer.id)}
          className="w-full mt-auto py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Записаться на тренировку
        </button>
      </div>
    </div>
  );
};