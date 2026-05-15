import api from './api'

const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData)
  },

  getMyOrders: async () => {
    return await api.get('/orders/my')
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`)
  },
}

export default orderService