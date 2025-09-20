import { useCallback } from 'react';
import { api } from '../../lib/api';

interface SystemInfo {
  ms: string;
  version: string;
}

export const useSystem = () => {
  const getSystemInfo = useCallback(async (): Promise<SystemInfo> => {
    try {
      // Buscar dados da rota raiz do backend
      const response = await api.get('/');
      // console.log('System info:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações do sistema:', error);
      throw error;
    }
  }, []);

  return {
    getSystemInfo,
  };
};