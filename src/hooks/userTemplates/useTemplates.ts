import { useState } from 'react';
import { api } from '../../lib/api';
import { CreateTemplateData, UpdateTemplateData } from '../../types';

export const useTemplates = () => {
  const [loading, setLoading] = useState(false);

  const getTemplates = async (page: number = 1, limit: number = 10, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/api/v1/templates-email?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/templates-email/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: CreateTemplateData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/templates-email', templateData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, templateData: UpdateTemplateData) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/v1/templates-email/${id}`, templateData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/v1/templates-email/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplateStatus = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/v1/templates-email/${id}/toggle`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const exportTemplates = async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/templates-email/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTemplateVariables = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/templates-email/variables');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultTemplate = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/v1/templates-email/${id}/set-default`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateStatus,
    exportTemplates,
    getTemplateVariables,
    setDefaultTemplate,
  };
};