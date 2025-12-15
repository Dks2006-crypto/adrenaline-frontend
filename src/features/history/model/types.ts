// Types for history feature

export interface HistoryEntry {
  id: number;
  date: string;
  created_at: string; // ISO string for formatting
  start_time: string;
  end_time: string;
  training_description: string;
  status: 'completed' | 'cancelled' | 'no_show';
  type: 'group' | 'personal';
  
  // For group classes
  group_class?: {
    id: number;
    title: string;
    service: {
      title: string;
    };
    trainer: {
      name: string;
      last_name: string;
    };
  };
  
  // For personal training
  trainer?: {
    id: number;
    name: string;
    last_name: string;
  };
  
  // Client info (for trainers)
  client?: {
    id: number;
    name: string;
    last_name: string;
  };
  
  // Additional info
  note?: string;
  rating?: number;
  feedback?: string;
}

export interface HistoryFilters {
  date_from?: string;
  date_to?: string;
  status?: string;
  type?: string;
}

export interface HistoryStats {
  total_sessions: number;
  completed_sessions: number;
  cancelled_sessions: number;
  no_show_sessions: number;
  total_hours: number;
  average_rating?: number;
}