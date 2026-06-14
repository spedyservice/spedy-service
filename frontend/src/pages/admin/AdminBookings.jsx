import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaEye, FaTrash, FaSearch, FaDownload, 
  FaSpinner, FaCalendarAlt, FaClock, FaUser, FaPhone, 
  FaMapMarkerAlt, FaWrench, FaTimes, FaHistory, FaAngleLeft, FaAngleRight
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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

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
        setCurrentPage(1)
      }
    } catch (error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => fetchBookings()

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await bookingService.deleteBooking(deleteId)
      toast.success('Booking deleted')
      setDeleteId(null)
      setShowDeleteConfirm(false)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to delete booking')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => status?.replace('_', ' ') || status

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(bookings.length / itemsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-500 text-sm">View and manage all service requests</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm text-sm">
            <FaDownload size={14} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, customer, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={handleSearch} className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Desktop Table – with sticky actions column */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Booking ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product / Brand</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Issue</th>
                <th className="sticky right-0 bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentBookings.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No bookings found</td></tr>
              ) : (
                currentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-mono font-semibold">{booking.bookingId}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>{booking.productCategory}</div>
                      {booking.brandName && <div className="text-xs text-gray-500">{booking.brandName}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{new Date(booking.preferredDate).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{booking.timeSlot}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="text-xs border rounded-md py-1 px-2 bg-white focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate" title={booking.address}>
                      {booking.address}{booking.pincode ? `, ${booking.pincode}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate" title={booking.issueDescription}>
                      {booking.issueDescription || '—'}
                    </td>
                    <td className="sticky right-0 bg-white px-4 py-3 text-center shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedBooking(booking); setShowViewModal(true); }}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => { setDeleteId(booking._id); setShowDeleteConfirm(true); }}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards – unchanged */}
        <div className="md:hidden space-y-4">
          {currentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm">No bookings found</div>
          ) : (
            currentBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold break-all">{booking.bookingId}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="text-xs border rounded-md py-1 px-2 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div><span className="font-medium">Product:</span> {booking.productCategory} {booking.brandName && `(${booking.brandName})`}</div>
                  <div><span className="font-medium">Customer:</span> {booking.customerName} | {booking.phone}</div>
                  <div><span className="font-medium">Date/Time:</span> {new Date(booking.preferredDate).toLocaleDateString('en-IN')} • {booking.timeSlot}</div>
                  <div><span className="font-medium">Address:</span> {booking.address}{booking.pincode ? `, ${booking.pincode}` : ''}</div>
                  <div><span className="font-medium">Issue:</span> {booking.issueDescription || '—'}</div>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t flex justify-between">
                  <button onClick={() => { setSelectedBooking(booking); setShowViewModal(true); }} className="text-blue-600 text-sm flex items-center gap-1">
                    <FaEye size={12} /> View Details
                  </button>
                  <button onClick={() => { setDeleteId(booking._id); setShowDeleteConfirm(true); }} className="text-red-500 text-sm flex items-center gap-1">
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition"><FaAngleLeft size={16} /></button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100 transition"><FaAngleRight size={16} /></button>
          </div>
        )}
      </div>

      {/* View Details Modal (unchanged) */}
      <AnimatePresence>
        {showViewModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Booking ID</p><p className="font-mono font-bold text-gray-800">{selectedBooking.bookingId}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Status</p><span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>{getStatusText(selectedBooking.status)}</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Product Category</p><p className="font-medium">{selectedBooking.productCategory}</p></div>
                  <div><p className="text-xs text-gray-500">Brand</p><p className="font-medium">{selectedBooking.brandName || 'N/A'}</p></div>
                </div>
                <div><p className="text-xs text-gray-500">Issue</p><p className="font-medium">{selectedBooking.issueDescription || 'N/A'}</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Preferred Date</p><p className="font-medium">{new Date(selectedBooking.preferredDate).toLocaleDateString('en-IN')}</p></div>
                  <div><p className="text-xs text-gray-500">Time Slot</p><p className="font-medium">{selectedBooking.timeSlot}</p></div>
                </div>
                <div><p className="text-xs text-gray-500">Address</p><p className="font-medium">{selectedBooking.address}{selectedBooking.pincode ? `, ${selectedBooking.pincode}` : ''}</p></div>
                <div><p className="text-xs text-gray-500">Booked On</p><p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</p></div>
                <div className="border-t pt-3"><p className="text-xs font-semibold text-gray-700 mb-2">Customer Info</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{selectedBooking.customerName}</p></div>
                    <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedBooking.phone}</p></div>
                    <div className="sm:col-span-2"><p className="text-xs text-gray-500">Email</p><p className="font-medium break-all">{selectedBooking.email}</p></div>
                  </div>
                </div>
                {selectedBooking.adminNotes && <div className="bg-blue-50 p-3 rounded-lg"><p className="font-semibold text-blue-600 text-sm">Admin Notes</p><p className="text-blue-800 text-sm mt-1">{selectedBooking.adminNotes}</p></div>}
              </div>
              <div className="sticky bottom-0 bg-white border-t px-5 py-4 flex justify-end">
                <button onClick={() => setShowViewModal(false)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (unchanged) */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaTrash className="text-red-600 text-2xl" /></div>
              <h3 className="text-lg font-bold mb-2">Delete Booking?</h3>
              <p className="text-sm text-gray-600 mb-6">This will permanently remove the booking. This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setDeleteId(null); setShowDeleteConfirm(false); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminBookings