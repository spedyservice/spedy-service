import api from './api'

const brandService = {
  getAllBrands: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/brands?${queryParams}`)
    return response.data
  },

  getBrandById: async (id) => {
    const response = await api.get(`/brands/${id}`)
    return response.data
  },

  createBrand: async (brandData) => {
    // When sending FormData, do NOT set Content-Type manually.
    // Axios will automatically set the correct multipart/form-data boundary.
    const response = await api.post('/brands', brandData)
    return response.data
  },

  updateBrand: async (id, brandData) => {
    const response = await api.put(`/brands/${id}`, brandData)
    return response.data
  },

  toggleBrandStatus: async (id) => {
    const response = await api.patch(`/brands/${id}/toggle-status`)
    return response.data
  },

  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`)
    return response.data
  },
}

export default brandService