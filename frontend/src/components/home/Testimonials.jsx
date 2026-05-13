import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa'
import api from '../../services/api'

const Testimonials = () => {
  const [reviews, setReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get('/bookings/reviews/public')
      if (response.data.success && response.data.data.length > 0) {
        setReviews(response.data.data)
      } else {
        setReviews([])
      }
    } catch (error) {
      console.error('Error fetching real reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    if (reviews.length <= 1) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const goToPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { x: { type: 'spring', stiffness: 400, damping: 35 }, opacity: { duration: 0.3 } }
    },
    exit: (direction) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.96,
      transition: { opacity: { duration: 0.2 } }
    })
  }

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) return null

  const current = reviews[currentIndex]

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-1"
            style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}>
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Real feedback from real customers
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-700" />

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8 md:p-10"
              >
                <div className="flex justify-center mb-4">
                  <FaQuoteLeft className="text-blue-100 text-4xl sm:text-5xl" />
                </div>

                <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-6 text-center italic font-light">
                  “{current.review || 'No review text'}”
                </p>

                {/* Stars – now using inline style for guaranteed yellow color */}
                <div className="flex justify-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ color: i < (current.rating || 0) ? '#facc15' : '#e5e7eb' }}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
                      {getInitials(current.customerName)}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {current.customerName}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <FaCheckCircle className="text-xs" />
                        <span>Verified Customer</span>
                      </div>
                    </div>
                  </div>
                  {current.updatedAt && (
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(current.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {reviews.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-200 focus:outline-none"
                aria-label="Previous review"
              >
                <FaChevronLeft className="text-sm sm:text-base" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-200 focus:outline-none"
                aria-label="Next review"
              >
                <FaChevronRight className="text-sm sm:text-base" />
              </button>
            </>
          )}

          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-8 h-2.5 bg-blue-600'
                      : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials