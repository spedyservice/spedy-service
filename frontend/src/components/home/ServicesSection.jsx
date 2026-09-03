import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import serviceService from '../../services/serviceService'
import ServiceCard from '../common/ServiceCard'

// ── Fallback background colour ──
const FALLBACK_BG = '#030014'

// ── Spotlight Glow wrapper – desktop only ──
const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(204, 255, 0, 0.12)' }) => {
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Only attach mouse events on desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768
    if (!isDesktop) return

    const element = cardRef.current
    if (!element) return

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

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
      <section className="py-12" style={{ backgroundColor: FALLBACK_BG }}>
        <div className="container-custom text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading services...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12" style={{ backgroundColor: FALLBACK_BG }}>
        <div className="container-custom text-center">
          <p className="text-red-500 text-sm">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 underline text-sm">Retry</button>
        </div>
      </section>
    )
  }

  if (services.length === 0) return null

  const totalSlides = services.length

  return (
    <section className="py-10 sm:py-14 overflow-hidden relative bg-black">
      {/* Video Background – with preload="metadata" */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204103_f607742e-09da-4cf5-bb06-4e67b0a531de.mp4"
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 container-custom max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Our <span className="text-[#CCFF00]">Services</span>
            </h2>
          </div>
          {totalSlides > 8 && (
            <Link to="/services" className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#CCFF00] font-semibold text-sm whitespace-nowrap transition-colors border-b border-transparent hover:border-[#CCFF00] pb-0.5">
              View All <FaArrowRight className="text-xs" />
            </Link>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-[#0a0a1a] border border-white/10 rounded-full shadow-lg text-white/70 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors duration-200"
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
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <SpotlightCard
                  className="h-full rounded-2xl bg-white/5 md:backdrop-blur-sm border border-white/5 hover:border-[#CCFF00]/30 transition-colors duration-200"
                  spotlightColor="rgba(204, 255, 0, 0.10)"
                >
                  <ServiceCard service={service} />
                </SpotlightCard>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-[#0a0a1a] border border-white/10 rounded-full shadow-lg text-white/70 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors duration-200"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4 sm:mt-5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-200 ${
                i === activeIndex
                  ? 'bg-[#CCFF00] w-6 sm:w-8 shadow-[0_0_12px_rgba(204,255,0,0.5)]'
                  : 'bg-white/20 hover:bg-white/40'
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