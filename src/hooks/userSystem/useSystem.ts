import { useState } from 'react';
import { api } from '../../lib/api';

interface SystemInfo {
  ms: string;
  version: string;
  uptime: string;
  memory: {
    used: string;
    total: string;
    percentage: number;
  };
  disk: {
    used: string;
    total: string;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
}

interface DashboardStats {
  totalUsers: number;
  totalWebServices: number;
  totalEmails: number;
  activeServices: number;
}

export const useSystem = () => {
  const [loading, setLoading] = useState(false);

  const getSystemInfo = async (): Promise<SystemInfo> => {
    try {
      setLoading(true);
      const response = await api.get('/api/system/info');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
      setLoading(true);
      const response = await api.get('/api/system/dashboard-stats');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSystemHealth = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/system/health');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSystemLogs = async (page: number = 1, limit: number = 50, level?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/api/system/logs?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearSystemLogs = async (olderThan?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (olderThan) {
        params.append('olderThan', olderThan);
      }

      const response = await api.delete(`/api/system/logs?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restartSystem = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/system/restart');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getSystemInfo,
    getDashboardStats,
    getSystemHealth,
    getSystemLogs,
    clearSystemLogs,
    restartSystem,
  };
};