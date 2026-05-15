import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import categoryService from '../../services/categoryService'

const ProductCategorySection = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)

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

  // Mouse wheel: use native smooth scrolling
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e) => {
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 100 : -100
        const target = container.scrollLeft + delta
        container.scrollTo({ left: target, behavior: 'smooth' })
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  // Drag to scroll
  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeftStart(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.style.cursor = 'grabbing'
    scrollContainerRef.current.style.userSelect = 'none'
    e.preventDefault()
  }

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    const newScrollLeft = scrollLeftStart - walk
    scrollContainerRef.current.scrollLeft = newScrollLeft
  }, [isDragging, startX, scrollLeftStart])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = ''
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (loading || categories.length === 0) return null

  return (
    <section className="bg-white pt-14 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: 'grab',
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth'
          }}
          onMouseDown={handleMouseDown}
        >
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

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default ProductCategorySection