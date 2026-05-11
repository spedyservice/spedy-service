import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaQuoteLeft, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import settingService from '../../services/settingService'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await settingService.getSettings()
        if (response.data?.testimonials && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials)
        } else {
          setTestimonials([
            {
              name: 'Priya Sharma',
              rating: 5,
              comment: 'Very satisfied with their washing machine repair service. Quick response, affordable pricing, and genuine parts. The 30-day warranty gives great peace of mind!',
              verified: true
            },
            {
              name: 'Amit Patel',
              rating: 5,
              comment: 'Best electronics repair service in the area. Fixed my refrigerator at a very reasonable cost. The technician explained everything clearly. Will definitely use again!',
              verified: true
            },
            {
              name: 'Sneha Das',
              rating: 5,
              comment: 'Impressed by their professionalism and transparency. My microwave was repaired quickly and they even provided helpful maintenance tips. Trustworthy service!',
              verified: true
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        setTestimonials([
          {
            name: 'Priya Sharma',
            rating: 5,
            comment: 'Very satisfied with their washing machine repair service. Quick response, affordable pricing, and genuine parts.',
            verified: true
          },
          {
            name: 'Amit Patel',
            rating: 5,
            comment: 'Best electronics repair service in the area. Fixed my refrigerator at a very reasonable cost.',
            verified: true
          },
          {
            name: 'Sneha Das',
            rating: 5,
            comment: 'Impressed by their professionalism and transparency. Trustworthy service!',
            verified: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const goToPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  }

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="container-custom text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="container-custom">
        
        {/* Header – compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Testimonials
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 mb-1">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-xs max-w-lg mx-auto">
            Trusted by hundreds of satisfied customers
          </p>
        </motion.div>

        {/* Testimonial Slider – smaller max-width */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 sm:p-8"
              >
                {/* Quote Icon */}
                <FaQuoteLeft className="text-blue-100 text-2xl sm:text-3xl mb-4" />
                
                {/* Comment */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  "{currentTestimonial.comment}"
                </p>
                
                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                
                {/* Customer Info */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(currentTestimonial.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{currentTestimonial.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Verified Customer
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows – smaller */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </>
          )}

          {/* Dots Indicator – tighter */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 h-1.5 bg-blue-600 rounded-full'
                      : 'w-1.5 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

export default Testimonials