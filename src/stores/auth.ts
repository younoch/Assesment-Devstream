// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../../api/client';
import type { LoginCredentials } from './types/auth';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem('accessToken') || null);
const refreshToken = ref<string | null>(localStorage.getItem('refreshToken') || null);

  const isAuthenticated = computed(() => !!accessToken.value);

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    if(newAccessToken) {
      accessToken.value = newAccessToken;
      localStorage.setItem('accessToken', newAccessToken);
    }
    if(newRefreshToken) {
      refreshToken.value = newRefreshToken;
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  }

  function clearAuth() {
    accessToken.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const res = await apiClient.post('/token/', credentials, { withCredentials: true });
      
      setTokens(res.data.data.access_token, res.data.data.refresh_token);
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function refreshAccessToken(): Promise<string | null> {
    clearAuth();
    try {
      const res = await apiClient.post('/token/refresh/', {
        refresh_token: refreshToken.value
      }, { withCredentials: true });
      console.log('refresh token called');
      console.log(res.data.data.access_token);
      
      setTokens(res.data.data.access_token, '');
      return res.data.access;
    } catch (err) {
      clearAuth();
      await router.push('/login');
      return null;
    }
  }


  return {
    loading,
    error,
    isAuthenticated,
    accessToken,
    login,
    refreshAccessToken,
    clearAuth,
  };
});
