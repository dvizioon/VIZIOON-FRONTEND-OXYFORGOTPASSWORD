import { useState } from 'react';
import { api } from '../../lib/api';
import { CreateUserData, UpdateUserData } from '../../types';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);

  const getUsers = async (page: number = 1, limit: number = 10, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/api/user/all?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/user', userData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: UpdateUserData) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/user/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const exportUsers = async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      setLoading(true);
      const response = await api.get(`/api/user/export?format=${format}`, {
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
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    exportUsers,
  };
};