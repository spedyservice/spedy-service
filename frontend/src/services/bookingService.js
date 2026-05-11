import api from './api'

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  getAllBookings: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/bookings?${queryParams}`)
    return response.data
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/mybookings')
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  updateBookingStatus: async (id, statusData) => {
    const response = await api.put(`/bookings/${id}/status`, statusData)
    return response.data
  },

  cancelBooking: async (id, cancellationReason) => {
    const response = await api.post(`/bookings/${id}/cancel`, { cancellationReason })
    return response.data
  },

  addReview: async (id, rating, review) => {
    const response = await api.post(`/bookings/${id}/review`, { rating, review })
    return response.data
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`)
    return response.data
  },

  getBookingStats: async () => {
    const response = await api.get('/bookings/stats/overview')
    return response.data
  },
}

export default bookingService