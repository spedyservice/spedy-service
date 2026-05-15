import api from './api'

const productService = {
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return await api.get(`/products?${queryParams}`)
  },

  getFeaturedProducts: async () => {
    return await api.get('/products/featured')
  },

  getProductById: async (id) => {
    return await api.get(`/products/${id}`)
  },

  getProductBySlug: async (slug) => {
    return await api.get(`/products/slug/${slug}`)
  },
}

export default productService