import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import productService from '../services/productService'
import reviewService from '../services/reviewService'
import cartService from '../services/cartService'
import ProductCard from '../components/common/ProductCard'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await productService.getProductBySlug(slug)
      if (response.success) {
        setProduct(response.data)
        fetchSimilarProducts(response.data.category?._id)
        fetchReviews(response.data._id)
      }
    } catch (error) {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarProducts = async (categoryId) => {
    if (!categoryId) return
    try {
      const response = await productService.getAllProducts({ category: categoryId, limit: 4 })
      if (response.success) {
        setSimilarProducts(response.data.filter(p => p.slug !== slug).slice(0, 4))
      }
    } catch (error) { /* silent */ }
  }

  const fetchReviews = async (productId) => {
    try {
      const response = await reviewService.getProductReviews(productId)
      if (response.success) setReviews(response.data)
    } catch (error) { /* silent */ }
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      await cartService.addToCart(product._id, 1)
      toast.success('Added to cart')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      toast.error('Please login first')
    } finally {
      setAddingToCart(false)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<FaStar key={i} className="text-yellow-400" />)
      else if (i === fullStars && hasHalf) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />)
    }
    return stars
  }

  const discountPercent = product?.salePrice && product?.price > 0
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0"> {/* removed top padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-8">
        {/* Back link */}
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-blue-600 mb-4 text-sm">
          <FaArrowLeft size={14} />
          <span className="font-medium">Back to Shop</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-3 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Images – larger on mobile */}
            <div>
              <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-4 h-64 sm:h-80 md:h-96">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details – smaller text */}
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center gap-1 mb-2 text-sm">
                {renderStars(product.rating || 0)}
                <span className="text-gray-500 ml-1">({product.numReviews || 0} reviews)</span>
              </div>

              <div className="mb-3">
                {product.salePrice ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl md:text-3xl font-bold text-blue-600">₹{product.salePrice}</span>
                    <span className="text-base md:text-lg text-gray-400 line-through">₹{product.price}</span>
                    {discountPercent && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-blue-600">₹{product.price}</span>
                )}
              </div>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">{product.description}</p>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md"
              >
                <FaShoppingCart size={14} />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-3 md:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-semibold text-xs">{review.user?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-xs text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similarProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage