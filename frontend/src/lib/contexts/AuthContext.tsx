'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserType = 'student' | 'institute' | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('userType');
    if (saved) {
      setIsLoggedIn(true);
      setUserType(saved as UserType);
    }
  }, []);

  const login = (type: UserType) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (type) localStorage.setItem('userType', type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('userType');
  };

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};