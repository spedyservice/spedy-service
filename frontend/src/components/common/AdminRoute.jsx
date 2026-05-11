import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'
import toast from 'react-hot-toast'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    toast.error('Please login to access admin panel')
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    toast.error('Access denied. Admin only area.')
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute