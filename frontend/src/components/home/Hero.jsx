import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa'
import bannerService from '../../services/bannerService'

const Hero = () => {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Store the currently displayed image (prevents flicker while new one loads)
  const [displayedImage, setDisplayedImage] = useState(null)
  // Ref to hold the Image() object for preloading
  const preloadRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerService.getBanners()
        if (response.success && response.data.length > 0) {
          setBanners(response.data)
          // Set the initial displayed image
          const first = response.data[0]
          const img = isMobile && first.mobileImage ? first.mobileImage : first.desktopImage
          setDisplayedImage(img)
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  // Preload the image for the current slide and then update displayedImage
  useEffect(() => {
    if (banners.length === 0) return
    const current = banners[currentSlide]
    const nextImage = isMobile && current.mobileImage ? current.mobileImage : current.desktopImage
    // If the image hasn't changed, skip
    if (displayedImage === nextImage) return

    // Preload the new image
    const img = new Image()
    img.src = nextImage
    preloadRef.current = img

    img.onload = () => {
      setDisplayedImage(nextImage)
      preloadRef.current = null
    }
    img.onerror = () => {
      // Fallback: still set it even on error to avoid stuck state
      setDisplayedImage(nextImage)
      preloadRef.current = null
    }

    // Cleanup if component unmounts or slide changes quickly
    return () => {
      if (preloadRef.current) {
        preloadRef.current.onload = null
        preloadRef.current.onerror = null
        preloadRef.current = null
      }
    }
  }, [currentSlide, banners, isMobile, displayedImage])

  useEffect(() => {
    if (banners.length <= 1) return
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % banners.length), 5000)
    return () => clearInterval(id)
  }, [banners.length])

  const goToSlide = (index) => setCurrentSlide(index)
  const prev = () => setCurrentSlide((s) => (s - 1 + banners.length) % banners.length)
  const next = () => setCurrentSlide((s) => (s + 1) % banners.length)

  if (loading) {
    return (
      <section className="pt-6 pb-6 md:pb-10">
        <div className="max-w-[1260px] mx-auto px-4 sm:px-6">
          <div className="rounded-xl bg-gray-200 animate-pulse h-[250px] sm:h-[400px] flex items-center justify-center">
            <FaSpinner className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) return null

  const current = banners[currentSlide]
  const showButton = current.buttonText && current.buttonText.trim().length > 0

  return (
    <section className="pt-6 pb-6 md:pb-10">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          {/* Image container with crossfade effect */}
          <div className="relative w-full" style={{ minHeight: '250px', maxHeight: '500px' }}>
            {displayedImage && (
              <img
                src={displayedImage}
                alt={current.title || ''}
                className="w-full object-cover transition-opacity duration-700 ease-in-out"
                style={{ minHeight: '250px', maxHeight: '500px', opacity: 1 }}
              />
            )}
            {/* A duplicate low-opacity image is not needed because we only swap when preloaded, but for a real crossfade we could stack two. Since we preload before swapping, there is no blank frame. */}
          </div>

          {/* Gradient overlay and button */}
          {showButton && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          )}
          {showButton && (
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center z-10">
              <Link
                to={current.buttonLink || '/shop'}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-base"
              >
                {current.buttonText}
              </Link>
            </div>
          )}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition"
              >
                <FaChevronLeft size={14} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition"
              >
                <FaChevronRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </>
          )}

          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-14 md:bottom-16 left-0 right-0 flex justify-center gap-2 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentSlide
                      ? 'w-7 h-2 bg-blue-600'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'
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

export default Hero