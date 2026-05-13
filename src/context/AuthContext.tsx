import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type AuthUser = {
  name: string;
  role: 'shopper';
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('demo-market-user');
    return cached ? (JSON.parse(cached) as AuthUser) : null;
  });

  const login = (name: string) => {
    const normalized = name?.trim() || 'Visitante';
    const authUser: AuthUser = {
      name: normalized,
      role: 'shopper'
    };

    localStorage.setItem('demo-market-user', JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('demo-market-user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [user]
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