import api from './api'

const brandService = {
  getAllBrands: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return await api.get(`/brands?${queryParams}`)
  },
  getBrandById: async (id) => {
    return await api.get(`/brands/${id}`)
  },
  createBrand: async (brandData) => {
    return await api.post('/brands', brandData)
  },
  updateBrand: async (id, brandData) => {
    return await api.put(`/brands/${id}`, brandData)
  },
  toggleBrandStatus: async (id) => {
    return await api.patch(`/brands/${id}/toggle-status`)
  },
  deleteBrand: async (id) => {
    return await api.delete(`/brands/${id}`)
  },
}

export default brandService