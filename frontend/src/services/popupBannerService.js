import api from './api';

const popupBannerService = {
  getActiveBanner: async () => {
    return await api.get('/popup-banner/active');
  },
  getAllBanners: async () => {
    return await api.get('/admin/popup-banners');
  },
  createBanner: async (data) => {
    return await api.post('/admin/popup-banners', data);
  },
  updateBanner: async (id, data) => {
    return await api.put(`/admin/popup-banners/${id}`, data);
  },
  deleteBanner: async (id) => {
    return await api.delete(`/admin/popup-banners/${id}`);
  },
};

export default popupBannerService;