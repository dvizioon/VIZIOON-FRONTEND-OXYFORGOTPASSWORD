import { useState } from 'react';
import { api } from '../../lib/api';
import { ResetPasswordRequest, ValidateTokenRequest, ChangePasswordRequest } from '../../types';

export const useMoodle = () => {
  const [loading, setLoading] = useState(false);

  const requestPasswordReset = async (data: ResetPasswordRequest) => {
    try {
      setLoading(true);
      const response = await api.post('/api/moodle/reset-password', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateResetToken = async (data: ValidateTokenRequest) => {
    try {
      setLoading(true);
      const response = await api.post('/api/moodle/validate-token', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      setLoading(true);
      const response = await api.post('/api/moodle/change-password', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testMoodleConnection = async (moodleUrl: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/moodle/test-connection', { moodleUrl });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMoodleUsers = async (moodleUrl: string, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ moodleUrl });
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/api/moodle/users?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const findMoodleUser = async (data: { moodleUrl: string; email?: string; username?: string }) => {
    try {
      setLoading(true);
      const response = await api.post('/api/moodle/find-user', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    requestPasswordReset,
    validateResetToken,
    changePassword,
    testMoodleConnection,
    getMoodleUsers,
    findMoodleUser,
  };
};