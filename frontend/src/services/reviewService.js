import api from './api'

const reviewService = {
  getProductReviews: async (productId) => {
    return await api.get(`/reviews/product/${productId}`)
  },

  createReview: async (data) => {
    return await api.post('/reviews', data)
  },
}

export default reviewService