import api from './api'

const CACHE_KEY = 'spedy_banners_cache'
const CACHE_TTL = 60000 // 1 minute

const bannerService = {
  getBanners: async () => {
    // Try to load from cache
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_TTL) {
          // Return cached data – it has the shape { success, data }
          return data
        }
      } catch (e) {
        // Cache is corrupted – ignore
      }
    }

    // No valid cache – fetch from API
    const response = await api.get('/banners')
    // response is already { success, data } because your api interceptor unwraps it

    // Store in cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: response,
      timestamp: Date.now()
    }))

    return response
  },

  getAllBanners: async () => {
    return await api.get('/banners/admin')
  },

  createBanner: async (formData) => {
    const response = await api.post('/banners', formData)
    localStorage.removeItem(CACHE_KEY) // Clear cache so users see new banner
    return response
  },

  updateBanner: async (id, formData) => {
    const response = await api.put(`/banners/${id}`, formData)
    localStorage.removeItem(CACHE_KEY)
    return response
  },

  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`)
    localStorage.removeItem(CACHE_KEY)
    return response
  },
}

export default bannerService