import { useState } from 'react';
import { api } from '../../lib/api';
import { CreateWebServiceData, UpdateWebServiceData } from '../../types';

export const useWebServices = () => {
  const [loading, setLoading] = useState(false);

  const getWebServices = async (page: number = 1, limit: number = 10, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/v1/webservice?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWebServiceById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/v1/webservice/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createWebService = async (webServiceData: CreateWebServiceData) => {
    try {
      setLoading(true);
      const response = await api.post('/v1/webservice', webServiceData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWebService = async (id: string, webServiceData: UpdateWebServiceData) => {
    try {
      setLoading(true);
      const response = await api.put(`/v1/webservice/${id}`, webServiceData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWebService = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/v1/webservice/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleWebServiceStatus = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.patch(`/v1/webservice/${id}/toggle`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const exportWebServices = async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      setLoading(true);
      const response = await api.get(`/v1/webservice/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getWebServices,
    getWebServiceById,
    createWebService,
    updateWebService,
    deleteWebService,
    toggleWebServiceStatus,
    exportWebServices,
  };
};