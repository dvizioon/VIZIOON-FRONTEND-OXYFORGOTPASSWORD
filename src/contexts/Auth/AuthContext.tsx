import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../../types';
import { useAuth } from '../../hooks/userAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  getCurrentUserInfo: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuth, user, loading, handleLogin, handleLogout, getCurrentUserInfo } = useAuth();


  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    await handleLogin({ email, password, rememberMe });
  };

  const logout = () => {
    handleLogout();
  };

  const value = {
    user: user as User | null,
    isAuthenticated: isAuth,
    isLoading: loading,
    login,
    logout,
    getCurrentUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};