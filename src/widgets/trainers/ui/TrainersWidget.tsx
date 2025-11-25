import { useState } from 'react';
import { TrainerList } from '@/features/trainer-list';
import BookingModal from '@/shared/ui/ui/BookingModal';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const TrainersWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const { token } = useAuthStore();

  const handleBookClick = (trainerId: number) => {
    if (!token) {
      toast.error('Для записи необходимо войти в систему.');
      return;
    }
    if (!trainerId || trainerId <= 0) {
      toast.error('Неверный ID тренера.');
      return;
    }
    setSelectedTrainerId(trainerId);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    setSelectedTrainerId(null);
    toast.success('Запись отправлена. Тренер скоро свяжется с вами!');
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">
          Наши <span className="text-indigo-600">профессиональные</span> тренеры
        </h2>

        <TrainerList onBook={handleBookClick} />

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