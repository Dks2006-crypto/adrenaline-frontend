import api from '@/lib/api';
import { Trainer } from './types';

export const trainerApi = {
  getPublicTrainers: (): Promise<Trainer[]> => {
    return api.get('/public/trainers').then(res => res.data);
  },
  updatePersonalBookingsSetting: (accepts_personal_bookings: boolean): Promise<{message: string; accepts_personal_bookings: boolean}> => {
    return api.patch('/trainer/personal-bookings-setting', { accepts_personal_bookings }).then(res => res.data);
  },
};