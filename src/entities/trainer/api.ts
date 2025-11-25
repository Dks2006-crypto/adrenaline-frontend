import api from '@/lib/api';
import { Trainer } from './types';

export const trainerApi = {
  getPublicTrainers: (): Promise<Trainer[]> => {
    return api.get('/public/trainers').then(res => res.data);
  },
};