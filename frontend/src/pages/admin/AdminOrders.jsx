import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaSpinner, FaShoppingBag, FaPhone, FaMapMarkerAlt, FaUser,
  FaCalendarAlt, FaMoneyBillWave, FaTrash
} from 'react-icons/fa'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
    if (!window.confirm('Permanently delete this cancelled order?')) return
    try {
      await adminService.deleteOrder(orderId)   // we'll add this method next
      toast.success('Order deleted permanently')
      fetchOrders()
    } catch (error) { toast.error('Failed to delete order') }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="ml-3 text-gray-600 text-sm">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold">Manage Orders</h1>
          <p className="text-gray-600 text-xs md:text-sm mt-0.5">View and update customer orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {orders.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">No orders found.</div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="px-4 py-3 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono font-semibold text-sm">{order._id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border rounded-lg py-1 px-2 focus:outline-none focus:border-blue-500 cursor-pointer bg-white"
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
                    {/* DELETE button – visible only when cancelled */}
                    {order.orderStatus === 'cancelled' && (
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete Order"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="px-4 py-3 border-b grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FaUser className="text-gray-400 text-xs flex-shrink-0" />
                    <span className="font-medium">{order.shippingAddress?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaPhone className="text-gray-400 text-xs flex-shrink-0" />
                    <span>{order.shippingAddress?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-1.5 md:col-span-2">
                    <FaMapMarkerAlt className="text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                    </span>
                  </div>
                </div>

                {/* Order Summary Row */}
                <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 border-b">
                  <div className="flex items-center gap-1">
                    <FaShoppingBag size={12} />
                    <span>{order.paymentMethod?.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt size={12} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMoneyBillWave size={12} />
                    <span className="font-bold text-gray-800">₹{order.totalPrice}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
                  <div className="divide-y divide-gray-100">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-2 text-sm">
                        <img
                          src={item.image || 'https://via.placeholder.com/50'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AdminOrders