import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrl, getAuthToken } from './api';

const API_URL = getApiUrl();

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useSupermarkets = () => {
  return useQuery({
    queryKey: ['supermarkets'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/supermarkets`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch supermarkets');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/sectors`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch sectors');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  return {
    invalidateSupermarkets: () =>
      queryClient.invalidateQueries({ queryKey: ['supermarkets'] }),
    invalidateSectors: () =>
      queryClient.invalidateQueries({ queryKey: ['sectors'] }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
};
