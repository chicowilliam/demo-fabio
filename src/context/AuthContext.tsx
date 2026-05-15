import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createAbility, type AppAbility } from '../lib/abilities';
import { clearStoredAuth, getApiUrl, getStoredAuth, setStoredAuth } from '../lib/api';

export type AuthUser = {
  name: string;
  role: 'shopper' | 'admin';
  id?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  ability: AppAbility;
  login: (name: string, role?: 'shopper' | 'admin', adminCode?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

const API_URL = getApiUrl();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth()?.user ?? null);
  const [token, setToken] = useState<string | null>(() => getStoredAuth()?.token ?? null);

  const [ability, setAbility] = useState<AppAbility>(() => {
    const role = user?.role || 'shopper';
    return createAbility(role);
  });

  const login = async (
    name: string,
    role: 'shopper' | 'admin' = 'shopper',
    adminCode?: string
  ): Promise<void> => {
    const normalized = name?.trim() || 'Visitante';
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: normalized,
        role,
        ...(adminCode ? { adminCode } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorBody.message || 'Login failed');
    }

    const payload = (await response.json()) as { token: string; user: AuthUser };

    const newAbility = createAbility(payload.user.role);
    setStoredAuth({ token: payload.token, user: payload.user });
    setToken(payload.token);
    setUser(payload.user);
    setAbility(newAbility);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    setAbility(createAbility('shopper'));
  };

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      ability,
      login,
      logout,
      isAdmin,
    }),
    [user, token, ability]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}