import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSpinner, FaEye, FaShoppingBag, FaRupeeSign } from 'react-icons/fa'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await orderService.getMyOrders()
      if (response.success) setOrders(response.data)
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const config = {
      pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' }
    }
    return config[status] || { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[65px] md:pt-[80px]">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-[65px] md:pt-[80px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders.</p>
            <Link to="/shop" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, idx) => {
              const statusConfig = getStatusConfig(order.orderStatus)
              // Get first item image (if exists)
              const firstItemImage = order.items?.[0]?.image || 'https://via.placeholder.com/60?text=No+Image'
              // List product names
              const productNames = order.items?.map(item => item.name).filter(Boolean) || []
              const displayNames = productNames.slice(0, 2).join(', ')
              const extraCount = productNames.length - 2
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="p-4 md:p-5">
                    {/* Top row: Order ID and Status */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">ORDER ID</span>
                        <p className="font-mono text-sm font-semibold text-gray-800">{order._id.slice(-10)}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Product summary with image and names */}
                    <div className="flex gap-3 mb-3">
                      <img
                        src={firstItemImage}
                        alt="Product"
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Image' }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {order.items?.[0]?.name || 'Product'}
                        </p>
                        {order.items.length > 1 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {/* Bottom row: Price and Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <FaRupeeSign size={14} className="text-gray-600" />
                        <span className="text-lg font-bold text-gray-900">{order.totalPrice.toLocaleString()}</span>
                      </div>
                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center gap-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                      >
                        <FaEye size={12} />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage