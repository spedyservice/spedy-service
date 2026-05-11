import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import bookingService from '../services/bookingService'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaWrench, FaEye, FaRupeeSign } from 'react-icons/fa'

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

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
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">My <span className="text-blue-600">Bookings</span></h1>
            <p className="text-gray-600">Track and manage your service requests</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
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
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <span className="text-sm text-gray-500 font-mono">ID: {booking.bookingId}</span>
                        </div>
                        <h3 className="text-xl font-bold">{booking.productCategory}</h3>
                        <p className="text-gray-600">Brand: {booking.brandName}</p>
                      </div>
                      <Link
                        to={`/bookings/${booking._id}`}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                      >
                        <FaEye className="text-sm" />
                        <span>View Details</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div className="flex items-center space-x-3">
                          <FaMapMarkerAlt className="text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-medium truncate">{booking.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.finalAmount > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FaRupeeSign className="text-green-600" />
                          <div>
                            <p className="text-xs text-green-600 font-semibold">Final Amount</p>
                            <p className="text-lg font-bold text-green-700">₹{booking.finalAmount}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {booking.issueDescription && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <FaWrench className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Issue Description</p>
                            <p className="text-sm text-gray-700">{booking.issueDescription}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {booking.adminNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
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
    </div>
  )
}

export default MyBookingsPage