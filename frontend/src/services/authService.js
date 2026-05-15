import api from './api'

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    // response = { success, data: { user, token } }
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  },

  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { credential })
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    // response.data is the user object (no wrapper)
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (code, password) => {
    const response = await api.post('/auth/reset-password', { code, password })
    return response.data
  },

  isAdmin: () => {
    const user = authService.getCurrentUser()
    return user?.role === 'admin'
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },
}

export default authService