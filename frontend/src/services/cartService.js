import api from './api'

const cartService = {
  getCart: async () => {
    return await api.get('/cart')
  },

  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart/add', { productId, quantity })
  },

  updateCartItem: async (productId, quantity) => {
    return await api.put(`/cart/${productId}`, { quantity })
  },

  removeFromCart: async (productId) => {
    return await api.delete(`/cart/${productId}`)
  },

  clearCart: async () => {
    return await api.delete('/cart')
  },
}

export default cartService