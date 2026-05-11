import api from './api'

const categoryService = {
  getAllCategories: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/categories?${queryParams}`)
    return response.data
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },
}

export default categoryService