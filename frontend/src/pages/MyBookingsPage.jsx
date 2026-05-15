import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import bookingService from '../services/bookingService'
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaWrench,
  FaEye, FaRupeeSign, FaStar, FaRegStar, FaTimes
} from 'react-icons/fa'

// Review modal (unchanged)
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
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <FaTimes size={18} />
            </button>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl sm:text-4xl transition-colors p-1"
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-yellow-400 drop-shadow" />
                ) : (
                  <FaRegStar className="text-gray-300 hover:text-yellow-400" />
                )}
              </button>
            ))}
          </div>
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
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-blue-100 text-blue-800',
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
    <div className="min-h-screen bg-gray-50 pt-[65px] md:pt-[80px] pb-12">
      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              My <span className="text-blue-700">Bookings</span>
            </h1>
            <p className="text-gray-500 text-sm">Track and manage your service requests</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any service bookings yet.</p>
              <Link to="/book-now" className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                Book Your First Service
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">#{booking.bookingId}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-700 transition-colors"
                        >
                          <FaEye size={12} />
                          <span>View</span>
                        </Link>
                        {booking.status === 'completed' && !booking.rating && (
                          <button
                            onClick={() => openReviewModal(booking._id)}
                            className="inline-flex items-center gap-1 text-sm text-yellow-700 hover:text-yellow-800 transition-colors"
                          >
                            <FaStar size={12} />
                            <span>Review</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-base font-semibold text-gray-900">{booking.productCategory}</h3>
                      <p className="text-xs text-gray-500">Brand: {booking.brandName}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-blue-600 text-xs" />
                        <div>
                          <p className="text-xs text-gray-500 leading-tight">Date</p>
                          <p className="text-sm font-medium">{new Date(booking.preferredDate).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-blue-600 text-xs" />
                        <div>
                          <p className="text-xs text-gray-500 leading-tight">Time</p>
                          <p className="text-sm font-medium truncate">{booking.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 sm:col-span-2">
                        <FaMapMarkerAlt className="text-blue-600 text-xs flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 leading-tight">Location</p>
                          <p className="text-sm text-gray-700 truncate">{booking.address}</p>
                        </div>
                      </div>
                    </div>

                    {booking.issueDescription && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-start gap-2">
                        <FaWrench className="text-blue-600 text-xs mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">{booking.issueDescription}</p>
                      </div>
                    )}

                    {booking.finalAmount > 0 && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                        <FaRupeeSign size={10} />
                        <span>₹{booking.finalAmount}</span>
                      </div>
                    )}

                    {booking.rating && (
                      <div className="mt-3 flex items-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} className={`w-3 h-3 ${s <= booking.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                        {booking.review && <span className="text-xs text-gray-500 ml-2">{booking.review}</span>}
                      </div>
                    )}

                    {booking.adminNotes && (
                      <div className="mt-3 text-xs text-blue-700 bg-blue-50 p-2 rounded-md">
                        <span className="font-semibold">Note:</span> {booking.adminNotes}
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