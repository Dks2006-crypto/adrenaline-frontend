import { useEffect, useState } from 'react';
import { trainerApi, Trainer } from '@/entities/trainer';
import toast from 'react-hot-toast';

export const useTrainerList = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainerApi
      .getPublicTrainers()
      .then(setTrainers)
      .catch((err) => {
        console.error('Ошибка загрузки тренеров:', err);
        toast.error('Не удалось загрузить список тренеров');
      })
      .finally(() => setLoading(false));
  }, []);

  return { trainers, loading };
};