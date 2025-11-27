import { Trainer } from '@/entities/trainer';
export interface TrainerListState {
  trainers: Trainer[];
  loading: boolean;
  error: string | null;
}