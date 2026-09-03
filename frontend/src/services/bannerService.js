import api from './api'

const CACHE_KEY = 'spedy_banners_cache'
const CACHE_TTL = 60000 // 1 minute

const bannerService = {
  getBanners: async () => {
    // Try to load from cache
    const cached = localStorage.getItem(CACHE_KEY)
    let parsedCache = null
    if (cached) {
      try {
        parsedCache = JSON.parse(cached)
        const { data, timestamp } = parsedCache
        if (Date.now() - timestamp < CACHE_TTL) {
          // ✅ Return cached data immediately (stale-while-revalidate)
          // Then fetch fresh in background and update cache
          setTimeout(() => {
            // Background refresh
            bannerService._fetchAndCache()
          }, 0)
          return data
        }
      } catch (e) {
        // Cache corrupted – ignore
      }
    }

    // No valid cache – fetch fresh and wait
    return await bannerService._fetchAndCache()
  },

  // Internal method to fetch and store
  _fetchAndCache: async () => {
    const response = await api.get('/banners')
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
    localStorage.removeItem(CACHE_KEY)
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