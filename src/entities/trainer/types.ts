export interface Trainer {
  id: number;
  name: string;
  last_name?: string;
  avatar_url: string | null;
  specialties: string[] | null;
  bio: string | null;
}