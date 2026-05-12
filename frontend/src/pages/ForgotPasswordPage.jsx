import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaEnvelope, FaArrowLeft, FaSpinner, FaCheckCircle,
  FaLock, FaKey
} from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()

  // ── Step 1 : Request email ──
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // ── Step 2 : Reset with code ──
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetting, setResetting] = useState(false)

  // ---------- Send Email ----------
  const handleSendEmail = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    setLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email })
      if (response.data.success) {
        toast.success(response.data.message)
        setSent(true)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Reset Password ----------
  const handleReset = async (e) => {
    e.preventDefault()
    if (!code || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    if (code.length !== 6) {
      toast.error('Please enter a 6‑digit code')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setResetting(true)
    try {
      const response = await api.post('/auth/reset-password', { code, password })
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6"
        >
          <FaArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>

        {!sent ? (
          // ── STEP 1 : Ask for email ──
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter your email and we’ll send you a 6‑digit reset code.
            </p>

            <form onSubmit={handleSendEmail} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>
          </>
        ) : (
          // ── STEP 2 : Code & new password ──
          <>
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Check Your Email</h1>
              <p className="text-gray-500 text-sm">
                We sent a 6‑digit code to <strong>{email}</strong>. Enter it below along with your new password.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reset Code
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all tracking-[8px] text-center text-lg font-mono"
                    placeholder="000000"
                    disabled={resetting}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="At least 6 characters"
                    disabled={resetting}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Repeat your password"
                    disabled={resetting}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetting}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md"
              >
                {resetting ? <FaSpinner className="animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage