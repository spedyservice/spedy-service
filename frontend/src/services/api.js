// FILE PATH: frontend/src/services/api.js

import axios from 'axios';

// Helper to get API base URL with /api suffix
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      // Ensure the URL ends with /api
      const normalizedUrl = envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
      return normalizedUrl;
    }
    return '/api'; // fallback
  }
  return '/api'; // development proxy
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('📤 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('📥 API Response Error:', error.response?.config?.url, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      const isPublicPath = error.response?.config?.url?.includes('/auth/');
      if (!isPublicPath) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject({
      success: false,
      message: error.response?.data?.message || error.message || 'Network error',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;