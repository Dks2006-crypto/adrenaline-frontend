"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { HistoryEntry, HistoryFilters, HistoryStats } from "../../model/types";

export const useHistory = (filters?: HistoryFilters) => {
  return useQuery<HistoryEntry[]>({
    queryKey: ["history", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.type) params.append("type", filters.type);
      
      const response = await api.get(`/history?${params.toString()}`);
      return response.data;
    },
  });
};

export const useHistoryStats = () => {
  return useQuery<HistoryStats>({
    queryKey: ["history-stats"],
    queryFn: () => api.get("/history/stats").then((res) => res.data),
  });
};

export const useTrainerHistory = (trainerId?: number, filters?: HistoryFilters) => {
  return useQuery<HistoryEntry[]>({
    queryKey: ["trainer-history", trainerId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (trainerId) params.append("trainer_id", trainerId.toString());
      
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.type) params.append("type", filters.type);
      
      const response = await api.get(`/history/trainer?${params.toString()}`);
      return response.data;
    },
    enabled: !!trainerId,
  });
};

export const useClientHistory = (clientId?: number, filters?: HistoryFilters) => {
  return useQuery<HistoryEntry[]>({
    queryKey: ["client-history", clientId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (clientId) params.append("client_id", clientId.toString());
      
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.type) params.append("type", filters.type);
      
      const response = await api.get(`/history/client?${params.toString()}`);
      return response.data;
    },
    enabled: !!clientId,
  });
};