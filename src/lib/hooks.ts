import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrl, getAuthToken } from './api';

const API_URL = getApiUrl();

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to post data');
  }

  return response.json() as Promise<T>;
}

type StaffOperationsResponse = {
  mode: 'picking' | 'restock';
  totalItems: number;
  pickingOrder: Array<{
    itemName: string;
    sectorId: string;
    sectorTitle: string;
    aisle: string;
    stock: {
      status: 'ok' | 'low' | 'critical';
      available: number;
      threshold: number;
    };
  }>;
  restockQueue: Array<{
    sector: string;
    aisle: string;
    itemCount: number;
    criticalCount: number;
    lowCount: number;
  }>;
};

export const useSupermarkets = () => {
  return useQuery({
    queryKey: ['supermarkets'],
    queryFn: async () => fetchJson(`${API_URL}/api/supermarkets`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSupermarketSuggestions = (search: string) => {
  return useQuery({
    queryKey: ['supermarket-suggestions', search],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        limit: '6',
      });

      return fetchJson(`${API_URL}/api/supermarkets?${params.toString()}`);
    },
    enabled: search.trim().length >= 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => fetchJson(`${API_URL}/api/sectors`),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useStaffOperations = (
  mode: 'picking' | 'restock',
  selectedItemNames: string[]
) => {
  return useQuery({
    queryKey: ['staff-operations', mode, selectedItemNames],
    queryFn: async () =>
      postJson<StaffOperationsResponse>(`${API_URL}/api/sectors/operations`, {
        mode,
        selectedItemNames,
      }),
    enabled: selectedItemNames.length > 0,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
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
