import api from './api'

const productService = {
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/products?${queryParams}`)
    return response.data
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured')
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`)
    return response.data
  },
}

export default productService