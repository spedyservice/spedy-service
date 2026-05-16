import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSpinner, FaShoppingBag, FaPhone, FaMapMarkerAlt, FaUser,
  FaCalendarAlt, FaMoneyBillWave, FaTrash, FaEye, FaTimes,
  FaEnvelope, FaBoxOpen
} from 'react-icons/fa'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllOrders()
      if (response.success) setOrders(response.data)
    } catch (error) { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status)
      toast.success(`Order status updated to ${status}`)
      fetchOrders()
    } catch (error) { toast.error('Failed to update status') }
  }

  const handleDelete = async (orderId) => {
    if (!window.confirm('Permanently delete this order? This action cannot be undone.')) return
    try {
      await adminService.deleteOrder(orderId)
      toast.success('Order deleted permanently')
      fetchOrders()
    } catch (error) { toast.error('Failed to delete order') }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="ml-3 text-gray-600 text-sm">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 text-sm mt-1">View and update customer orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {orders.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm text-gray-500">No orders found.</div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="px-4 py-3 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                    <p className="font-mono font-semibold text-sm">{order._id.slice(-10)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border rounded-md py-1 px-2 focus:outline-none focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    {order.orderStatus === 'cancelled' && (
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                        title="Delete Order"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="px-4 py-3 border-b space-y-2">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <div className="flex items-center gap-1.5">
                      <FaUser className="text-gray-400 text-xs" />
                      <span className="font-medium">{order.shippingAddress?.fullName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaPhone className="text-gray-400 text-xs" />
                      <span>{order.shippingAddress?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaEnvelope className="text-gray-400 text-xs" />
                      <span className="truncate">{order.user?.email || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-sm">
                    <FaMapMarkerAlt className="text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                    </span>
                  </div>
                </div>

                {/* Order Summary Row */}
                <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 border-b bg-gray-50">
                  <div className="flex items-center gap-1"><FaShoppingBag size={12} /><span>{order.paymentMethod?.toUpperCase()}</span></div>
                  <div className="flex items-center gap-1"><FaCalendarAlt size={12} /><span>{formatDate(order.createdAt)}</span></div>
                  <div className="flex items-center gap-1"><FaMoneyBillWave size={12} /><span className="font-bold text-gray-800">₹{order.totalPrice}</span></div>
                </div>

                {/* Items Preview (first 2 items) */}
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-8 h-8 rounded object-cover bg-gray-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <span className="font-semibold text-sm">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-xs text-blue-600 mt-1">+ {order.items.length - 2} more item(s)</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-2 bg-gray-50 border-t flex justify-between">
                  <button
                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                    className="text-blue-600 text-sm flex items-center gap-1 font-medium hover:text-blue-800 transition"
                  >
                    <FaEye size={14} /> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <div className="p-5 space-y-5">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p><p className="font-mono font-bold">{selectedOrder._id}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Status</p><span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</span></div>
                  <div><p className="text-xs text-gray-500">Order Date</p><p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p></div>
                  <div><p className="text-xs text-gray-500">Payment Method</p><p className="font-medium">{selectedOrder.paymentMethod?.toUpperCase()}</p></div>
                  <div><p className="text-xs text-gray-500">Payment Status</p><p className="font-medium">{selectedOrder.isPaid ? 'Paid' : 'Pending'}</p></div>
                  {selectedOrder.paidAt && <div><p className="text-xs text-gray-500">Paid On</p><p className="font-medium">{formatDateTime(selectedOrder.paidAt)}</p></div>}
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Shipping Address</p>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}</p>
                    <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Order Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                        <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white" onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <div className="font-bold text-gray-900">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Price Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedOrder.itemsPrice}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{selectedOrder.shippingPrice === 0 ? 'Free' : `₹${selectedOrder.shippingPrice}`}</span></div>
                    <div className="flex justify-between font-bold pt-1 border-t"><span>Total</span><span>₹{selectedOrder.totalPrice}</span></div>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t px-5 py-4 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminOrders