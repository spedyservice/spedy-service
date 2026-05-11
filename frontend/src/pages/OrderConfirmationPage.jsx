import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaSpinner, FaBox } from 'react-icons/fa'
import orderService from '../services/orderService'

// Reliable placeholder that never fails (inline SVG)
const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%236b7280%22 font-family=%22Arial%22 font-size=%2210%22 dy=%22.35em%22 x=%2210%22 y=%2250%22%3ENo Image%3C/text%3E%3C/svg%3E'

const OrderConfirmationPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const response = await orderService.getOrderById(id)
      if (response.success) setOrder(response.data)
    } catch (error) {
      console.error('Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }

  // Image component with fallback
  const OrderItemImage = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER)

    const handleError = () => {
      setImgSrc(PLACEHOLDER)
    }

    return (
      <img
        src={imgSrc}
        alt={alt}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        onError={handleError}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link to="/my-orders" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            View My Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm p-5 md:p-8 text-center"
        >
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm mb-5">
            Thank you for your purchase. Your order ID is <span className="font-mono font-semibold text-gray-700">{order._id}</span>
          </p>

          <div className="text-left border-t border-gray-100 pt-5 mt-5">
            <h2 className="font-bold text-base text-gray-900 mb-3">Order Details</h2>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-2.5 text-sm">
                  <OrderItemImage src={item.image} alt={item.name} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold text-sm">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-5 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-5 bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-semibold text-gray-800 mb-1">Shipping Address</p>
              <p className="text-xs sm:text-sm">{order.shippingAddress?.fullName}</p>
              <p className="text-xs sm:text-sm">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
              <p className="text-xs sm:text-sm">{order.shippingAddress?.pincode}</p>
              <p className="text-xs sm:text-sm">{order.shippingAddress?.phone}</p>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Order Status</span>
              <span className="font-semibold capitalize bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{order.orderStatus}</span>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/my-orders"
              className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="inline-block bg-gray-100 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage