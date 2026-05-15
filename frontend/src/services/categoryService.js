import api from './api'

const categoryService = {
  getAllCategories: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return await api.get(`/categories?${queryParams}`)
  },
  getCategoryById: async (id) => {
    return await api.get(`/categories/${id}`)
  },
}

export default categoryService