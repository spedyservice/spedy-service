import api from './api'

const reviewService = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`)
    return response.data
  },

  createReview: async (data) => {
    const response = await api.post('/reviews', data)
    return response.data
  },
}

export default reviewService