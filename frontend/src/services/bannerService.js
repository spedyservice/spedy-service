import api from './api';

const bannerService = {
  // Public
  getBanners: async () => {
    const response = await api.get('/banners');
    return response.data;
  },

  // Admin
  getAllBanners: async () => {
    const response = await api.get('/banners/admin');
    return response.data;
  },

  createBanner: async (formData) => {
    const response = await api.post('/banners', formData);
    return response.data;
  },

  updateBanner: async (id, formData) => {
    const response = await api.put(`/banners/${id}`, formData);
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },
};

export default bannerService;