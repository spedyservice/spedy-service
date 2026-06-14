import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa'
import api from '../../services/api'

const Testimonials = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    try {
      console.log('Fetching from /bookings/reviews/public')
      const response = await api.get('/bookings/reviews/public')
      console.log('Response:', response)

      let list = []
      if (response?.success && Array.isArray(response?.data)) {
        list = response.data
      } else if (Array.isArray(response)) {
        list = response
      }
      setReviews(list)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-400 text-sm">Loading reviews...</p>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
         
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Real feedback from real customers
          </p>
        </div>

        {/* Responsive grid – horizontal layout (replaces carousel) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col border border-gray-100"
            >
              {/* Quote icon */}
              <div className="mb-3">
                <FaQuoteLeft className="text-blue-100 text-3xl" />
              </div>

              {/* Review text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                “{review.review || 'Great service!'}”
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="w-4 h-4"
                    style={{ color: i < (review.rating || 5) ? '#facc15' : '#e5e7eb' }}
                  />
                ))}
              </div>

              {/* Customer info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {getInitials(review.customerName)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {review.customerName || 'Customer'}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <FaCheckCircle className="text-xs" />
                    <span>Verified Customer</span>
                  </div>
                </div>
              </div>

              {/* Date */}
              {review.reviewedAt && (
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {new Date(review.reviewedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials