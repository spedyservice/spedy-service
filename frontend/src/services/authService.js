import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.set('user', JSON.stringify(response.data));
    }
    return response;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getProfile: async () => {
    return await api.get('/auth/profile');
  },

  updateProfile: async (userData) => {
    return await api.put('/auth/profile', userData);
  },

  changePassword: async (passwordData) => {
    return await api.put('/auth/change-password', passwordData);
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (code, password) => {
    return await api.post('/auth/reset-password', { code, password });
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;