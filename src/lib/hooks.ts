import { useQuery, useQueryClient } from '@tanstack/react-query';

const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL?.trim();
  
  if (url) {
    return url.replace(/\/$/, '');
  }
  
  // In production, require explicit API URL
  if (import.meta.env.PROD) {
    throw new Error(
      'VITE_API_URL environment variable is required in production. ' +
      'Please set it in your .env or deployment configuration.'
    );
  }
  
  // Development fallback to localhost
  console.warn('VITE_API_URL not set, using development default: http://localhost:4000');
  return 'http://localhost:4000';
};

const API_URL = getApiUrl();

export const useSupermarkets = () => {
  return useQuery({
    queryKey: ['supermarkets'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/supermarkets`);
      if (!response.ok) throw new Error('Failed to fetch supermarkets');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSectors = () => {
  // Will be replaced with API call when backend endpoint is created
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      // TODO: Create /api/sectors endpoint in backend
      const response = await fetch(`${API_URL}/api/sectors`);
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
