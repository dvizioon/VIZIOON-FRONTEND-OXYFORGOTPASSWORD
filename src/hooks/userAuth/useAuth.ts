import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { User, LoginCredentials, AuthResponse } from '../../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const token = rememberMe 
        ? localStorage.getItem('authToken') 
        : sessionStorage.getItem('authToken');
      
      if (token) {
        // Verificar se o token ainda é válido
        const response = await api.get('/api/v1/user/profile');
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuth(true);
        } else {
          // Token inválido, limpar storage
          clearAuth();
        }
      }
    } catch (error) {
      // Token inválido ou erro na API
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success && response.data.token) {
        const { token, user: userData } = response.data;
        
        // Salvar token baseado na preferência rememberMe
        if (credentials.rememberMe) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('authToken', token);
          localStorage.removeItem('rememberMe');
        }
        
        setUser(userData || null);
        setIsAuth(true);
        
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro no login');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro no login';
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    setUser(null);
    setIsAuth(false);
  };

  const getCurrentUserInfo = async () => {
    try {
      const response = await api.get('/api/v1/user/profile');
      if (response.data.success) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  };

  return {
    user,
    isAuth,
    loading,
    handleLogin,
    handleLogout,
    getCurrentUserInfo
  };
};