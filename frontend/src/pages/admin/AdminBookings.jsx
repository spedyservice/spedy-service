import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaEye, FaTrash, FaSearch, FaFilter, 
  FaDownload, FaSpinner, FaCalendarAlt, FaClock,
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaWrench, FaTimes, FaHistory
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import bookingService from '../../services/bookingService'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (searchTerm) params.search = searchTerm
      
      const response = await bookingService.getAllBookings(params)
      if (response.success) {
        setBookings(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchBookings()
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, { status: newStatus })
      toast.success(`Booking status updated to ${newStatus}`)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await bookingService.deleteBooking(deleteId)
      toast.success('Booking deleted successfully')
      setDeleteId(null)
      setShowDeleteConfirm(false)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to delete booking')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    // reduced top/bottom padding significantly
    <div className="bg-gray-50 py-4 md:py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header – smaller on mobile */}
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Bookings</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5 md:mt-1">View and manage all service bookings</p>
          </div>
          <button className="btn-secondary inline-flex items-center space-x-2 text-sm">
            <FaDownload />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters – tighter padding */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, customer, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button onClick={handleSearch} className="btn-primary text-sm py-2">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Bookings Grid – cards unchanged, just less gap above */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {bookings.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">
              No bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Header: Booking ID + Status */}
                <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-mono font-semibold text-gray-700">{booking.bookingId}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="text-xs border rounded-lg py-1 px-2 focus:outline-none focus:border-blue-500 cursor-pointer bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Content grid – horizontal layout */}
                <div className="p-3 md:p-4 grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1.5 text-sm">
                  {/* Product & Brand */}
                  <div className="flex items-center gap-1.5">
                    <FaWrench className="text-gray-400 flex-shrink-0 text-xs" />
                    <span>
                      <span className="font-medium">{booking.productCategory}</span>
                      {booking.brandName && <span className="text-gray-500 ml-1">({booking.brandName})</span>}
                    </span>
                  </div>

                  {/* Customer Name */}
                  <div className="flex items-center gap-1.5">
                    <FaUser className="text-gray-400 flex-shrink-0 text-xs" />
                    <span>{booking.customerName}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-1.5">
                    <FaPhone className="text-gray-400 flex-shrink-0 text-xs" />
                    <span className="break-all">{booking.phone}</span>
                  </div>

                  {/* Preferred Date */}
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-gray-400 flex-shrink-0 text-xs" />
                    <span>{new Date(booking.preferredDate).toLocaleDateString('en-IN')}</span>
                  </div>

                  {/* Time Slot */}
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-gray-400 flex-shrink-0 text-xs" />
                    <span>{booking.timeSlot}</span>
                  </div>

                  {/* Booked At */}
                  <div className="flex items-center gap-1.5">
                    <FaHistory className="text-gray-400 flex-shrink-0 text-xs" />
                    <span className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-1.5 col-span-2 md:col-span-3">
                    <FaMapMarkerAlt className="text-gray-400 flex-shrink-0 mt-0.5 text-xs" />
                    <span className="text-xs">{booking.address}{booking.pincode ? `, ${booking.pincode}` : ''}</span>
                  </div>

                  {/* Issue */}
                  {booking.issueDescription && (
                    <div className="flex items-start gap-1.5 col-span-2 md:col-span-3">
                      <FaWrench className="text-gray-400 flex-shrink-0 mt-0.5 text-xs" />
                      <span className="text-gray-600 text-xs">{booking.issueDescription}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-2 border-t flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking)
                      setShowViewModal(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    <FaEye className="text-xs" /> View Details
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(booking._id)
                      setShowDeleteConfirm(true)
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                  >
                    <FaTrash className="text-xs" /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* View Details Modal (unchanged, but slightly smaller padding) */}
      <AnimatePresence>
        {showViewModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Booking Details</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              {/* ... rest identical, just reduced text sizes ... */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Booking ID</p>
                  <p className="font-mono font-bold">{selectedBooking.bookingId}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-500">Status</p><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>{getStatusText(selectedBooking.status)}</span></div>
                  <div><p className="text-xs text-gray-500">Product Category</p><p className="font-medium">{selectedBooking.productCategory}</p></div>
                  <div><p className="text-xs text-gray-500">Brand</p><p className="font-medium">{selectedBooking.brandName}</p></div>
                  <div><p className="text-xs text-gray-500">Issue</p><p className="font-medium">{selectedBooking.issueDescription || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Preferred Date</p><p className="font-medium">{new Date(selectedBooking.preferredDate).toLocaleDateString('en-IN')}</p></div>
                  <div><p className="text-xs text-gray-500">Time Slot</p><p className="font-medium">{selectedBooking.timeSlot}</p></div>
                  <div className="col-span-2"><p className="text-xs text-gray-500">Address</p><p className="font-medium">{selectedBooking.address}, {selectedBooking.pincode}</p></div>
                  <div className="col-span-2"><p className="text-xs text-gray-500">Booked At</p><p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</p></div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs font-semibold">Customer Info</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{selectedBooking.customerName}</p></div>
                    <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedBooking.phone}</p></div>
                    <div className="col-span-2"><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedBooking.email}</p></div>
                  </div>
                </div>

                {selectedBooking.adminNotes && (
                  <div className="bg-blue-50 p-2 rounded-lg text-xs">
                    <p className="font-semibold text-blue-600">Admin Notes</p>
                    <p className="text-blue-800">{selectedBooking.adminNotes}</p>
                  </div>
                )}
              </div>

              <button onClick={() => setShowViewModal(false)} className="mt-5 w-full btn-secondary text-sm">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (unchanged) */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center"
            >
              <FaTrash className="text-red-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Delete Booking?</h3>
              <p className="text-sm text-gray-600 mb-6">
                This will permanently remove the booking from the database. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setDeleteId(null)
                    setShowDeleteConfirm(false)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminBookings