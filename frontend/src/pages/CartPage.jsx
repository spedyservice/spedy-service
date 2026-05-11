import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaSpinner, FaShoppingBag } from 'react-icons/fa'
import cartService from '../services/cartService'
import toast from 'react-hot-toast'

const CartPage = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const response = await cartService.getCart()
      if (response.success) setCart(response.data)
    } catch (error) { toast.error('Failed to load cart') }
    finally { setLoading(false) }
  }

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return
    try {
      await cartService.updateCartItem(productId, newQty)
      fetchCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) { toast.error('Failed to update quantity') }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.removeFromCart(productId)
      toast.success('Item removed')
      fetchCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) { toast.error('Failed to remove item') }
  }

  // Lightweight placeholder – never blocked
  const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%236b7280%22 font-family=%22Arial%22 font-size=%2210%22 dy=%22.35em%22 x=%2210%22 y=%2250%22%3ENo Image%3C/text%3E%3C/svg%3E'

  const getImageSrc = (product) => {
    if (product?.images && product.images.length > 0 && product.images[0]) {
      return product.images[0]
    }
    return PLACEHOLDER
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  const items = cart?.items || []
  const subtotal = items.reduce((acc, item) => acc + ((item.product?.salePrice || item.product?.price || 0) * item.quantity), 0)
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Increased top padding so header sits well below fixed navbar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-4 md:pb-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            <FaArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 md:p-12 text-center">
            <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-5">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="inline-block bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div key={item.product?._id} layout className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex gap-3">
                  <img
                    src={getImageSrc(item.product)}
                    alt={item.product?.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product?.slug || item.product?._id}`} className="font-semibold text-gray-900 text-xs sm:text-sm hover:text-blue-600 line-clamp-1">
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ₹{item.product?.salePrice || item.product?.price}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <FaMinus size={11} />
                        </button>
                        <span className="px-2 sm:px-3 font-semibold text-xs sm:text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <FaPlus size={11} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product?._id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove item"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary – sticky top adjusted for navbar height */}
            <div className="bg-white rounded-xl shadow-sm p-4 h-fit sticky top-[120px]">
              <h2 className="text-base font-bold text-gray-900 mb-3">Order Summary</h2>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                <div className="border-t pt-2 flex justify-between text-sm sm:text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{total}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-md text-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage