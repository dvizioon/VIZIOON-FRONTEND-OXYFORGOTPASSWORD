import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';
import { User } from '../../types';

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const useAuth = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setIsAuth(true);
      getCurrentUserInfo();
    } else {
      setLoading(false);
    }
  }, []);

  // Interceptor para adicionar token automaticamente
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config: any) => {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Interceptor para tratar respostas
    const responseInterceptor = api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          handleLogout();
          toast.error('Sessão expirada. Faça login novamente.');
          navigate('/admin/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const handleLogin = async (loginData: LoginData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', loginData);
      const { token, user: userData } = response.data;

      if (loginData.rememberMe) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
      setIsAuth(true);
      
      toast.success(`Bem-vindo, ${userData.name}!`);
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    delete api.defaults.headers.Authorization;
    setUser(null);
    setIsAuth(false);
    navigate('/admin/login');
  };

  const getCurrentUserInfo = async () => {
    try {
      const response = await api.get('/api/user/profile');
      setUser(response.data.user);
      setLoading(false);
      return response.data.user;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      setLoading(false);
      handleLogout();
    }
  };

  return {
    isAuth,
    loading,
    user,
    handleLogin,
    handleLogout,
    getCurrentUserInfo,
  };
};

export default useAuth;
