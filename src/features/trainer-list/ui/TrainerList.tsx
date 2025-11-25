import { TrainerCard } from './TrainerCard';
import { useTrainerList } from '../lib/hooks/useTrainerList';

interface TrainerListProps {
  onBook: (trainerId: number) => void;
}

export const TrainerList = ({ onBook }: TrainerListProps) => {
  const { trainers, loading } = useTrainerList();

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Загрузка тренеров...
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Список тренеров пока пуст.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {trainers.map((trainer) => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          onBook={onBook}
        />
      ))}
    </div>
  );
};