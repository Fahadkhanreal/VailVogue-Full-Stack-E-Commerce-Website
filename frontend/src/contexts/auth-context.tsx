'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('veilvogue-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // This will be called from LoginForm
    // The actual API call is handled in the form component
    // This function is just for updating the context state
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    // This will be called from RegisterForm
    // The actual API call is handled in the form component
    // This function is just for updating the context state
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veilvogue-user');
    localStorage.removeItem('veilvogue-token');
    window.location.href = '/';
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUser: (newUser: User | null) => {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem('veilvogue-user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('veilvogue-user');
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
