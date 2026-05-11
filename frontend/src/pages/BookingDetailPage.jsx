import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import bookingService from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaWrench, 
  FaArrowLeft, FaRupeeSign, FaUser, FaPhone, FaEnvelope,
  FaStar, FaRegStar
} from 'react-icons/fa'

const BookingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    fetchBooking()
  }, [id])

  const fetchBooking = async () => {
    setLoading(true)
    try {
      const response = await bookingService.getBookingById(id)
      if (response.success) {
        setBooking(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch booking details')
      navigate('/my-bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation.')
      return
    }
    setCancelling(true)
    try {
      const response = await bookingService.cancelBooking(id, cancelReason)
      if (response.success) {
        toast.success('Booking cancelled successfully')
        fetchBooking()
        setShowCancelModal(false)
        setCancelReason('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!rating || !review) {
      toast.error('Please provide both rating and review')
      return
    }
    
    setSubmittingReview(true)
    try {
      const response = await bookingService.addReview(id, rating, review)
      if (response.success) {
        toast.success('Thank you for your feedback!')
        setShowReview(false)
        fetchBooking()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-blue-600 text-white',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return texts[status] || status
  }

  const canCancel = booking && ['pending', 'confirmed'].includes(booking.status)
  const canReview = booking && booking.status === 'completed' && !booking.rating

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Booking not found</p>
          <button onClick={() => navigate('/my-bookings')} className="btn-primary mt-4">
            Back to Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to My Bookings</span>
          </button>

          {/* Booking Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Booking ID</p>
                  <p className="text-2xl font-mono font-bold">{booking.bookingId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90 mb-1">Status</p>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{booking.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{booking.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{booking.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Product Category</p>
                    <p className="font-medium">{booking.productCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Brand</p>
                    <p className="font-medium">{booking.brandName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Issue Description</p>
                    <p className="font-medium">{booking.issueDescription}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Date</p>
                      <p className="font-medium">{new Date(booking.preferredDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaClock className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Time Slot</p>
                      <p className="font-medium">{booking.timeSlot}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium">{booking.address}, {booking.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              {booking.finalAmount > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaRupeeSign className="text-green-600 text-xl" />
                    <div>
                      <p className="text-xs text-green-600 font-semibold">Final Amount</p>
                      <p className="text-2xl font-bold text-green-700">₹{booking.finalAmount}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {booking.adminNotes && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Admin Note:</p>
                  <p className="text-sm text-blue-800">{booking.adminNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Cancel Booking
                  </button>
                )}
                
                {canReview && !showReview && (
                  <button
                    onClick={() => setShowReview(true)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReview && (
                <div className="mt-6 p-6 border-2 border-gray-200 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Share Your Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="input-label">Rating</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            {star <= rating ? (
                              <FaStar className="text-yellow-400 text-2xl" />
                            ) : (
                              <FaRegStar className="text-gray-300 text-2xl" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Your Review</label>
                      <textarea
                        rows="4"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="input-field"
                        placeholder="Tell us about your experience..."
                      ></textarea>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSubmitReview}
                        disabled={submittingReview}
                        className="btn-primary"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        onClick={() => setShowReview(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Review */}
              {booking.rating && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(booking.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                      {[...Array(5 - booking.rating)].map((_, i) => (
                        <FaRegStar key={i} className="text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{booking.review}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed on {new Date(booking.reviewedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cancellation Modal - placed directly in JSX to avoid redefinition */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold mb-4">Cancel Booking</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for cancellation.
              </p>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm mb-4"
                placeholder="e.g., Issue resolved, not needed, etc."
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                  disabled={cancelling}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookingDetailPage