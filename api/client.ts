// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const BASE_URL = 'https://api.sandbox.payinpos.com/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, 
});

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshTokenFailed = false;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (isRefreshTokenFailed) {
      return Promise.reject(error);
    }

    const isTokenExpired =
      error.response?.status === 403 &&
      error.response?.data?.message === 'Token has expired';

    const isUnauthorized = error.response?.status === 401;

    if ((isUnauthorized || isTokenExpired) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await authStore.refreshAccessToken();
        
        if (newAccessToken) {
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Process queued requests
          processQueue(null, newAccessToken);
          
          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token received');
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        processQueue(refreshError, undefined);
        isRefreshTokenFailed = true;
        authStore.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;