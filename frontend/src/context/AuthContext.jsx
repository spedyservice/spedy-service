import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const currentUser = authService.getCurrentUser()
      
      if (token && currentUser) {
        // ✅ Fallback: ensure token is attached
        if (!currentUser.token) {
          currentUser.token = token
        }
        setUser(currentUser)
        setIsAdmin(currentUser.role === 'admin')
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      // response.data contains user with token
      if (response.data) {
        setUser(response.data)
        setIsAdmin(response.data.role === 'admin')
        toast.success('Login successful!')
      }
      return response.data
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const googleLogin = async (credential) => {
    try {
      const response = await authService.googleLogin(credential)
      if (response.data) {
        setUser(response.data)
        setIsAdmin(response.data.role === 'admin')
        toast.success('Welcome back')
      }
      return response.data
    } catch (error) {
      toast.error(error.message || 'Google login failed')
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      if (response.data) {
        setUser(response.data)
        setIsAdmin(response.data.role === 'admin')
        toast.success('Registration successful!')
      }
      return response.data
    } catch (error) {
      toast.error(error.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAdmin(false)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      if (response.data) {
        setUser(prev => ({ ...prev, ...response.data }))
        toast.success('Profile updated successfully')
      }
      return response.data
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    setUser,
    setIsAdmin,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}