import { Trainer } from "@/entities/trainer";

interface TrainerCardProps {
  trainer: Trainer;
  onBook: (trainerId: number) => void;
}

export default function TrainerCard({ trainer, onBook }: TrainerCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative w-full h-64">
        <img
          src={trainer.avatar_url || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={`${trainer.name} ${trainer.last_name || ""}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          {trainer.name} {trainer.last_name}
        </h3>

        <p className="text-gray-600 mt-3 text-sm leading-relaxed">
          {trainer.bio || "Описание не указано"}
        </p>

        <button
          onClick={() => onBook(trainer.id)}
          className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Записаться
        </button>
      </div>
    </div>
  );
}

