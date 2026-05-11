import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import productService from '../../services/productService'
import ProductCard from '../common/ProductCard'

/*
  Centrale Sans (weight 700) must be loaded in your project.
  Add to index.html: 
  <link href="https://fonts.googleapis.com/css2?family=Centrale+Sans:wght@700&display=swap" rel="stylesheet">
*/

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getFeaturedProducts()
        if (response.success && response.data.length > 0) {
          setProducts(response.data)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className="py-10 md:py-14 bg-[#073bb4]">
      <div className="container-custom">
        {/* ── Header: left title, right View All button ── */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white"
            style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
          >
            Our Products
          </h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:bg-gray-50 transition-colors"
          >
            View All Products
            <FaArrowRight size={12} />
          </Link>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.slice(0, 8).map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts