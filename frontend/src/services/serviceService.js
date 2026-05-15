import api from './api'

const serviceService = {
  getAllServices: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return await api.get(`/services?${queryParams}`)
  },
  getServiceById: async (id) => {
    return await api.get(`/services/${id}`)
  },
  getPopularServices: async () => {
    return await api.get('/services/popular')
  },
  createService: async (serviceData) => {
    return await api.post('/services', serviceData)
  },
  updateService: async (id, serviceData) => {
    return await api.put(`/services/${id}`, serviceData)
  },
  toggleServiceStatus: async (id) => {
    return await api.patch(`/services/${id}/toggle-status`)
  },
  deleteService: async (id) => {
    return await api.delete(`/services/${id}`)
  },
}

export default serviceService