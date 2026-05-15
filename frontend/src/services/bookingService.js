import api from './api'

const bookingService = {
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData)
  },

  getAllBookings: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return await api.get(`/bookings?${queryParams}`)
  },

  getMyBookings: async () => {
    return await api.get('/bookings/mybookings')
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`)
  },

  updateBookingStatus: async (id, statusData) => {
    return await api.put(`/bookings/${id}/status`, statusData)
  },

  cancelBooking: async (id, cancellationReason) => {
    return await api.post(`/bookings/${id}/cancel`, { cancellationReason })
  },

  addReview: async (id, rating, review) => {
    return await api.post(`/bookings/${id}/review`, { rating, review })
  },

  deleteBooking: async (id) => {
    return await api.delete(`/bookings/${id}`)
  },

  getBookingStats: async () => {
    return await api.get('/bookings/stats/overview')
  },
}

export default bookingService