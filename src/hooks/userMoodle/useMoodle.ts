import { useState, useCallback } from 'react';
import { api } from '../../lib/api';
import { ResetPasswordRequest, ValidateTokenRequest, ChangePasswordRequest } from '../../types';

export const useMoodle = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUrls, setLoadingUrls] = useState(false);

  const requestPasswordReset = useCallback(async (data: ResetPasswordRequest) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/moodle/reset-password', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateResetToken = useCallback(async (data: ValidateTokenRequest) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/moodle/validate-reset-token', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/moodle/change-password', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const testMoodleConnection = useCallback(async (moodleUrl: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/moodle/test-connection', { moodleUrl });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMoodleUsers = useCallback(async (moodleUrl: string, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ moodleUrl });
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/api/v1/moodle/users?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const findMoodleUser = useCallback(async (data: { moodleUrl: string; email?: string; username?: string }) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/moodle/find-user', data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMoodleUrls = useCallback(async () => {
    try {
      setLoadingUrls(true);
      const response = await api.get('/api/v1/moodle/urls');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoadingUrls(false);
    }
  }, []);

  return {
    loading,
    loadingUrls,
    requestPasswordReset,
    validateResetToken,
    changePassword,
    testMoodleConnection,
    getMoodleUsers,
    findMoodleUser,
    getMoodleUrls,
  };
};