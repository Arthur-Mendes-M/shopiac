// AuthContext.tsx (substitua o conteúdo do seu provider por este)
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// valida token (mesma função que já temos)
const isValidToken = (tok: string | null) => {
  if (!tok) return false;
  const t = tok.trim();
  if (!t || t === 'null' || t === 'undefined') return false;
  const parts = t.split('.');
  if (parts.length === 3) {
    try {
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      if (payload && typeof payload.exp === 'number') {
        return Date.now() < payload.exp * 1000;
      }
    } catch (e) {
      /* fallback */
    }
  }
  return true;
};

const readInitialAuth = () => {
  try {
    const rawToken = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');

    const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;

    let user: User | null = null;
    if (rawUser && rawUser !== 'null' && rawUser !== 'undefined') {
      try {
        user = JSON.parse(rawUser);
      } catch {
        localStorage.removeItem('user');
        user = null;
      }
    }

    return { token, user };
  } catch (e) {
    return { token: null, user: null };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = readInitialAuth();
  // lazy init synchronously from localStorage
  const [token, setToken] = useState<string | null>(initial.token);
  const [user, setUser] = useState<User | null>(initial.user);
  // loading pode ficar false porque já lemos sincronamente; porém, se você for validar via servidor deixe true até validar.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // opcional: se quiser log ou validação async do token, faça aqui e ajuste setLoading(true/false)
    // Exemplo: setLoading(true); fetch('/me', ...) -> confirma token e setLoading(false)
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => {
      const updated = prev ? ({ ...prev, ...patch } as User) : (patch as User);
      try {
        if (updated) localStorage.setItem('user', JSON.stringify(updated));
        else localStorage.removeItem('user');
      } catch (e) {
        console.error('Erro ao salvar user no localStorage:', e);
      }
      return updated;
    });
  };

  const isAuthenticated = useMemo(() => {
    // note: não usamos "!loading && ..." aqui porque o guard de rota tratará loading separadamente.
    return isValidToken(token) && !!user;
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
