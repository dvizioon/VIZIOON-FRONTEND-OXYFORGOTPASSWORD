// Base API configuration using Axios
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Instância base do axios para ser usada pelo useAuth
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class BaseApi {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token automaticamente
    this.client.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar respostas
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout: A requisição demorou muito para responder');
        }
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          sessionStorage.removeItem('authToken');
          localStorage.removeItem('authToken');
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        if (error.message === 'Network Error') {
          throw new Error('Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.');
        }
        throw new Error(error.message || 'Erro na requisição');
      }
    );
  }

  protected async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.client.request<T>({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export { API_BASE_URL, api };
export default api;