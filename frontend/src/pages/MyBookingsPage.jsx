import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import bookingService from '../services/bookingService'
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaWrench,
  FaEye, FaRupeeSign, FaStar, FaRegStar, FaTimes
} from 'react-icons/fa'

// ⭐ Review modal – reused for each booking
const ReviewModal = ({ bookingId, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setRating(0)
      setHoverRating(0)
      setComment('')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a star rating')
      return
    }
    setSubmitting(true)
    try {
      await bookingService.addReview(bookingId, rating, comment)
      toast.success('Thank you for your feedback!')
      onReviewSubmitted && onReviewSubmitted()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Leave a Review</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Star rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl sm:text-4xl transition-colors p-1"
                aria-label={`Rate ${star} star`}
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-yellow-400 drop-shadow" />
                ) : (
                  <FaRegStar className="text-gray-300 hover:text-yellow-400" />
                )}
              </button>
            ))}
          </div>

          {/* Comment */}
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review (optional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-4"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState({ open: false, bookingId: null })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await bookingService.getMyBookings()
      if (response.success) {
        setBookings(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-blue-600 text-white',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled'
    }
    return texts[status] || status
  }

  const openReviewModal = (bookingId) => {
    setReviewModal({ open: true, bookingId })
  }

  const closeReviewModal = () => {
    setReviewModal({ open: false, bookingId: null })
  }

  const handleReviewSubmitted = () => {
    fetchBookings()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12"> {/* <-- removed top padding, added small top padding */}
      <div className="container-custom max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              My <span className="text-blue-600">Bookings</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Track and manage your service requests</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any service bookings yet.</p>
              <Link to="/book-now" className="btn-primary inline-block">
                Book Your First Service
              </Link>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6"> {/* reduced gap on mobile */}
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 md:p-6"> {/* reduced padding on mobile */}
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">ID: {booking.bookingId}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold">{booking.productCategory}</h3>
                        <p className="text-sm text-gray-600">Brand: {booking.brandName}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="flex items-center space-x-1 px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-sm"
                        >
                          <FaEye className="text-xs" />
                          <span>View</span>
                        </Link>

                        {booking.status === 'completed' && !booking.rating && (
                          <button
                            onClick={() => openReviewModal(booking._id)}
                            className="flex items-center space-x-1 px-3 py-1.5 md:px-4 md:py-2 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 hover:bg-yellow-100 transition-colors text-sm"
                          >
                            <FaStar className="text-sm" />
                            <span>Review</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 md:pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-blue-600 text-sm" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium">{new Date(booking.preferredDate).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-blue-600 text-sm" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="text-sm font-medium">{booking.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 col-span-1 sm:col-span-2 md:col-span-1">
                          <FaMapMarkerAlt className="text-blue-600 text-sm" />
                          <div className="truncate">
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm truncate">{booking.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.finalAmount > 0 && (
                      <div className="mt-3 p-2 md:p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FaRupeeSign className="text-green-600" />
                          <div>
                            <p className="text-xs text-green-600 font-semibold">Final Amount</p>
                            <p className="text-base font-bold text-green-700">₹{booking.finalAmount}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {booking.issueDescription && (
                      <div className="mt-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <FaWrench className="text-blue-600 mt-0.5 text-sm" />
                          <div>
                            <p className="text-xs text-gray-500">Issue</p>
                            <p className="text-sm text-gray-700">{booking.issueDescription}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {booking.rating && (
                      <div className="mt-3 p-2 md:p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          {[1,2,3,4,5].map(s => (
                            <FaStar key={s} className={s <= booking.rating ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'} />
                          ))}
                        </div>
                        {booking.review && <p className="text-sm text-gray-700">{booking.review}</p>}
                      </div>
                    )}

                    {booking.adminNotes && (
                      <div className="mt-3 p-2 md:p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-semibold mb-1">Admin Note:</p>
                        <p className="text-sm text-blue-800">{booking.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <ReviewModal
        bookingId={reviewModal.bookingId}
        isOpen={reviewModal.open}
        onClose={closeReviewModal}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  )
}

export default MyBookingsPage