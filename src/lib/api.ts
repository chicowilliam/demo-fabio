type StoredAuth = {
  token: string;
  user: {
    id?: string;
    name: string;
    role: 'shopper' | 'admin';
  };
};

const AUTH_STORAGE_KEY = 'demo-market-auth';
const LEGACY_USER_STORAGE_KEY = 'demo-market-user';

export const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL?.trim();

  if (url) {
    return url.replace(/\/$/, '');
  }

  if (import.meta.env.PROD) {
    throw new Error(
      'VITE_API_URL environment variable is required in production. ' +
        'Please set it in your .env or deployment configuration.'
    );
  }

  console.warn('VITE_API_URL not set, using development default: http://localhost:4000');
  return 'http://localhost:4000';
};

export const getStoredAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed?.token || !parsed?.user?.name || !parsed?.user?.role) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const setStoredAuth = (auth: StoredAuth): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
};

export const getAuthToken = (): string | null => {
  return getStoredAuth()?.token ?? null;
};
