export interface GroupClass {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  available_slots: number;
  price_cents: number;
  currency: string;
  recurrence_rule: string | null;
  trainer: {
    id: number;
    name: string;
    last_name: string;
    avatar_url: string | null;
    bio: string | null;
    specialties: string | null;
  } | null;
  service: {
    id: number;
    title: string;
    description: string;
  } | null;
}

export interface GroupClassListItem {
  id: number;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  available_slots: number;
  price_cents: number;
  currency: string;
  trainer: {
    id: number;
    name: string;
    last_name: string;
    avatar_url: string | null;
  } | null;
  service: {
    id: number;
    title: string;
  } | null;
}