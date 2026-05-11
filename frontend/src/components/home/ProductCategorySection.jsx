import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSpinner } from 'react-icons/fa'
import categoryService from '../../services/categoryService'

const ProductCategorySection = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories({ isActive: true })
        if (response.success && response.data.length > 0) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading || categories.length === 0) return null

  return (
    <section className="bg-white pt-14 pb-2">   {/* top padding added, bottom border removed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              className="snap-start flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/shop?category=${cat._id}`}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-200 group-hover:shadow-md transition-shadow duration-300">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-lg sm:text-xl">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors mt-1 text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </section>
  )
}

export default ProductCategorySection