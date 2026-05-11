import api from './api'

const serviceService = {
  getAllServices: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/services?${queryParams}`)
    return response.data
  },

  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`)
    return response.data
  },

  getPopularServices: async () => {
    const response = await api.get('/services/popular')
    return response.data
  },

  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData)
    return response.data
  },

  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData)
    return response.data
  },

  toggleServiceStatus: async (id) => {
    const response = await api.patch(`/services/${id}/toggle-status`)
    return response.data
  },

  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`)
    return response.data
  },
}

export default serviceService