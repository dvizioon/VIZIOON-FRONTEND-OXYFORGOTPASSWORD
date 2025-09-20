import { useState } from 'react';
import { api } from '../../lib/api';

export const useAuditing = () => {
  const [loading, setLoading] = useState(false);

  const getAuditLogs = async (
    page: number = 1, 
    limit: number = 10, 
    search?: string,
    status?: 'success' | 'error' | 'pending',
    startDate?: string,
    endDate?: string
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (status) {
        params.append('status', status);
      }
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }

      const response = await api.get(`/api/v1/auditing?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAuditLogById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/auditing/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAuditStats = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }

      const response = await api.get(`/api/v1/auditing/stats?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const exportAuditLogs = async (
    format: 'csv' | 'xlsx' = 'csv',
    startDate?: string,
    endDate?: string,
    status?: 'success' | 'error' | 'pending'
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        format,
      });
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/api/v1/auditing/export?${params}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAuditLog = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/v1/auditing/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAuditLogs = async (olderThan?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (olderThan) {
        params.append('olderThan', olderThan);
      }

      const response = await api.delete(`/api/v1/auditing/clear?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAuditLogs,
    getAuditLogById,
    getAuditStats,
    exportAuditLogs,
    deleteAuditLog,
    clearAuditLogs,
  };
};