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
      const currentUser = authService.getCurrentUser()
      if (currentUser && currentUser.token) {
        setUser(currentUser)
        setIsAdmin(currentUser.role === 'admin')
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      setUser(data)
      setIsAdmin(data.role === 'admin')
      toast.success('Login successful!')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const googleLogin = async (credential) => {
    try {
      const data = await authService.googleLogin(credential)
      setUser(data)
      setIsAdmin(data.role === 'admin')
      toast.success('Welcome back')   // ← changed message
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed')
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const data = await authService.register(userData)
      setUser(data)
      setIsAdmin(data.role === 'admin')
      toast.success('Registration successful!')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
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
      const data = await authService.updateProfile(userData)
      setUser(prev => ({ ...prev, ...data }))
      toast.success('Profile updated successfully')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
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