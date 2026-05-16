import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import serviceService from '../../services/serviceService'
import ServiceCard from '../common/ServiceCard'

const BG_HEX = '#073bb4'

const ServicesSection = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAllServices({ isActive: true })
        if (response.success && response.data.length > 0) {
          // Sort: "Other Electronics" at the end
          const sorted = [...response.data].sort((a, b) => {
            if (a.name === 'Other Electronics') return 1
            if (b.name === 'Other Electronics') return -1
            return 0
          })
          setServices(sorted)
        } else {
          setServices([])
        }
      } catch (err) {
        console.error('Error fetching services:', err)
        setError(err.response?.data?.message || err.message || 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const children = container.children
    if (children.length === 0) return
    const scrollLeft = container.scrollLeft
    let newIndex = 0
    let minDiff = Infinity
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const slideLeft = child.offsetLeft
      const diff = Math.abs(slideLeft - scrollLeft)
      if (diff < minDiff) {
        minDiff = diff
        newIndex = i
      }
    }
    setActiveIndex(prev => (prev !== newIndex ? newIndex : prev))
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll, services])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return
    const slide = container.children[0]
    if (!slide) return
    const slideWidth = slide.offsetWidth
    const gap = parseFloat(getComputedStyle(container).gap) || 12
    const scrollAmount = slideWidth + gap
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  const goToSlide = (index) => {
    const container = scrollContainerRef.current
    if (!container || !container.children[index]) return
    container.scrollTo({ left: container.children[index].offsetLeft, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="py-12" style={{ backgroundColor: BG_HEX }}>
        <div className="container-custom text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading services...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12" style={{ backgroundColor: BG_HEX }}>
        <div className="container-custom text-center">
          <p className="text-red-500 text-sm">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 underline text-sm">Retry</button>
        </div>
      </section>
    )
  }

  if (services.length === 0) return null

  // 🔥 NO SLICE – show ALL services
  const totalSlides = services.length

  return (
    <section className="py-10 sm:py-14 overflow-hidden" style={{ backgroundColor: BG_HEX }}>
      <div className="container-custom">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">Our Services</h2>
          {totalSlides > 8 && (
            <Link to="/services" className="inline-flex items-center gap-1.5 text-white hover:text-blue-700 font-semibold text-sm whitespace-nowrap transition-colors">
              View All <FaArrowRight className="text-xs" />
            </Link>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md border border-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service) => (
              <div
                key={service._id}
                className="snap-start flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] xl:w-[20vw]"
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md border border-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-4 sm:mt-5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                i === activeIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection