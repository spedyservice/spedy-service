import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'
import cartService from '../services/cartService'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [shipping, setShipping] = useState('free')
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const response = await cartService.getCart()
      if (response.success) {
        setCart(response.data)
      }
    } catch (error) { toast.error('Failed to load cart') }
    finally { setLoading(false) }
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.address || !address.city || !address.pincode || !address.phone) {
      toast.error('Please fill all address fields')
      return
    }

    setPlacing(true)
    try {
      const response = await orderService.createOrder({
        shippingAddress: address,
        paymentMethod,
        shippingPrice: shipping === 'free' ? 0 : 100
      })
      if (response.success) {
        toast.success('Order placed successfully!')
        window.dispatchEvent(new Event('cartUpdated'))
        navigate(`/order/${response.data._id}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[65px] md:pt-[80px]">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  const items = cart?.items || []
  const subtotal = items.reduce((acc, item) => acc + ((item.product?.salePrice || item.product?.price || 0) * item.quantity), 0)
  const shippingCost = shipping === 'free' ? 0 : 100
  const total = subtotal + shippingCost

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px] md:pt-[80px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate('/cart')} className="text-gray-600 hover:text-blue-600">
            <FaArrowLeft size={14} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column – Shipping + Payment */}
          <div className="lg:col-span-2 space-y-5">
            {/* Shipping Address – compact on mobile */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">Shipping Address</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={address.fullName} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Address *</label>
                  <textarea rows="2" name="address" value={address.address} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">City *</label>
                    <input type="text" name="city" value={address.city} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Pincode *</label>
                    <input type="text" name="pincode" maxLength={6} value={address.pincode} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone *</label>
                  <input type="tel" name="phone" maxLength={10} value={address.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 outline-none" required />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-semibold text-sm">Cash on Delivery (COD)</span>
                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right column – Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-4 h-fit sticky top-[calc(65px+1rem)] md:top-[calc(80px+1rem)]">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">Order Summary</h2>
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.product?._id} className="flex gap-3 py-2 text-sm">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={item.product?.name}
                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-semibold text-xs">₹{(item.product?.salePrice || item.product?.price || 0) * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
              <div className="flex justify-between text-base font-bold pt-2 border-t"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors shadow-md text-sm"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage