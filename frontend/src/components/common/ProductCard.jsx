import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaShoppingCart, FaSpinner } from 'react-icons/fa'
import cartService from '../../services/cartService'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const [addingToCart, setAddingToCart] = useState(false)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingToCart(true)
    try {
      await cartService.addToCart(product._id, 1)
      toast.success('Added to cart')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to add to cart'
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart')
        return
      }
      toast.error(message)
    } finally {
      setAddingToCart(false)
    }
  }

  const discountPercent =
    product.salePrice && product.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null

  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/300']

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-gray-200">
      {/* ── Image area (small on mobile, larger on desktop) ── */}
      <Link
        to={`/product/${product.slug || product._id}`}
        className="relative overflow-hidden bg-gray-50 h-28 sm:h-48 flex items-center justify-center p-2 sm:p-4"
      >
        <img
          src={images[currentImgIndex]}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {product.salePrice && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-semibold">
            Sale
          </span>
        )}
        {discountPercent && (
          <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-semibold shadow">
            {discountPercent}% OFF
          </span>
        )}
        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImgIndex(idx)
                }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImgIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* ── Details (compact mobile, normal desktop) ── */}
      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="text-[11px] sm:text-sm font-bold text-gray-900 line-clamp-2 mb-0.5 sm:mb-1 hover:text-blue-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-yellow-500 text-[10px] sm:text-xs mb-1 sm:mb-1.5">
          <FaStar />
          <span className="text-gray-600">{product.rating?.toFixed(1) || '0.0'}</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 sm:gap-2 mb-1.5 sm:mb-3">
            {product.salePrice ? (
              <>
                <span className="text-sm sm:text-lg font-bold text-blue-600">₹{product.salePrice}</span>
                <span className="text-[10px] sm:text-sm text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-blue-600">₹{product.price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full flex items-center justify-center gap-1 sm:gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-1.5 sm:py-2.5 rounded-md sm:rounded-lg text-[11px] sm:text-sm transition-colors shadow-sm"
          >
            {addingToCart ? (
              <FaSpinner className="animate-spin text-[10px] sm:text-xs" />
            ) : (
              <FaShoppingCart size={12} className="sm:w-3.5 sm:h-3.5" />
            )}
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard