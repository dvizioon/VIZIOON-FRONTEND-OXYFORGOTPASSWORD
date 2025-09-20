import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4567';
const ROOT_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4567';

// Criar instância do axios para API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Criar instância do axios para rota raiz (sem /api)
const rootApi = axios.create({
  baseURL: ROOT_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (apenas para api, não para rootApi)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas (apenas para api, não para rootApi)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('rememberMe');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export { api, rootApi };
export default api;