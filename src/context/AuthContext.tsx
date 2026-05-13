import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createAbility, type AppAbility } from '../lib/abilities';

export type AuthUser = {
  name: string;
  role: 'shopper' | 'admin';
  id?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  ability: AppAbility;
  login: (name: string, role?: 'shopper' | 'admin') => void;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const cached = localStorage.getItem('demo-market-user');
    return cached ? (JSON.parse(cached) as AuthUser) : null;
  });

  const [ability, setAbility] = useState<AppAbility>(() => {
    const role = user?.role || 'shopper';
    return createAbility(role);
  });

  const login = (name: string, role: 'shopper' | 'admin' = 'shopper') => {
    const normalized = name?.trim() || 'Visitante';
    const authUser: AuthUser = {
      name: normalized,
      role,
      id: crypto.randomUUID?.() || `user-${Date.now()}`,
    };

    const newAbility = createAbility(role);
    localStorage.setItem('demo-market-user', JSON.stringify(authUser));
    setUser(authUser);
    setAbility(newAbility);
  };

  const logout = () => {
    localStorage.removeItem('demo-market-user');
    setUser(null);
    setAbility(createAbility('shopper'));
  };

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      ability,
      login,
      logout,
      isAdmin,
    }),
    [user, ability]
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