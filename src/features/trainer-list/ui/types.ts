import { Trainer } from '@/entities/trainer';

export interface TrainerCardProps {
  trainer: Trainer;
  onBook: (trainerId: number) => void;
}

export interface TrainerListProps {
  onBook: (trainerId: number) => void;
}