// FILE PATH: frontend/src/services/api.js

import axios from 'axios';

// In production, use VITE_API_URL (your Render backend)
// In development, use '/api' which is proxied by Vite
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || '/api'
  : '/api';

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
    
    // If sending FormData, remove Content-Type header so browser sets it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Log in development only
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

// Response interceptor to handle errors and unwrap data
api.interceptors.response.use(
  (response) => {
    // Return response.data directly for cleaner usage in services
    // Your backend already wraps responses with { success, data, message }
    return response.data;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('📥 API Response Error:', error.response?.config?.url, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      // Don't auto-redirect for public routes – let components handle it
      const isPublicPath = error.response?.config?.url?.includes('/auth/');
      if (!isPublicPath) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Return a consistent error object
    return Promise.reject({
      success: false,
      message: error.response?.data?.message || error.message || 'Network error',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;