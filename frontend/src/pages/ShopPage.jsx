import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaSpinner, FaTimes, FaSlidersH } from 'react-icons/fa'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import ProductCard from '../components/common/ProductCard'
import toast from 'react-hot-toast'

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories({ isActive: true })
        if (res.success) setCategories(res.data)
      } catch (error) {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  // Fetch products with debounce on search term
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory, priceRange])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (searchTerm) params.search = searchTerm
      if (priceRange.min) params.minPrice = priceRange.min
      if (priceRange.max) params.maxPrice = priceRange.max

      const res = await productService.getAllProducts(params)
      if (res.success) setProducts(res.data)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setPriceRange({ min: '', max: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}>
            Our Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quality home appliances for your everyday needs
          </p>
        </div>

        {/* Search & filter toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
          >
            <FaSlidersH size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Collapsible filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
            {/* Category pills */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat._id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Price Range</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 outline-none"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <FaTimes size={12} /> Clear all filters
            </button>
          </div>
        )}

        {/* Active category chip */}
        {selectedCategory !== 'all' && (
          <div className="mb-5 flex items-center gap-2">
            <span className="text-xs text-gray-500">Active filter:</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
              {categories.find(c => c._id === selectedCategory)?.name || selectedCategory}
              <button onClick={() => setSelectedCategory('all')}>
                <FaTimes size={10} />
              </button>
            </span>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p className="text-lg font-semibold mb-1">No products found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}

export default ShopPage