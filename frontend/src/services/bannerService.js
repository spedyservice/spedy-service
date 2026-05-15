import api from './api'

const bannerService = {
  getBanners: async () => {
    return await api.get('/banners')
  },
  getAllBanners: async () => {
    return await api.get('/banners/admin')
  },
  createBanner: async (formData) => {
    return await api.post('/banners', formData)
  },
  updateBanner: async (id, formData) => {
    return await api.put(`/banners/${id}`, formData)
  },
  deleteBanner: async (id) => {
    return await api.delete(`/banners/${id}`)
  },
}

export default bannerService