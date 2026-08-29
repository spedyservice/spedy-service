import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaSpinner, FaSyncAlt } from 'react-icons/fa'
import bannerService from '../../services/bannerService'

const Hero = () => {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [displayedImage, setDisplayedImage] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const preloadRef = useRef(null)
  const fetchAttempts = useRef(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fetchBanners = useCallback(async (retry = false) => {
    setError(null)
    if (!retry) setLoading(true)
    setImageLoaded(false)
    try {
      const response = await bannerService.getBanners()
      if (response.success && response.data.length > 0) {
        setBanners(response.data)
        const first = response.data[0]
        const img = isMobile && first.mobileImage ? first.mobileImage : first.desktopImage
        setDisplayedImage(img)
        fetchAttempts.current = 0

        const preloadImg = new Image()
        preloadImg.src = img
        preloadImg.onload = () => {
          setImageLoaded(true)
          setLoading(false)
        }
        preloadImg.onerror = () => {
          setImageLoaded(true)
          setLoading(false)
        }
        preloadRef.current = preloadImg
      } else {
        throw new Error('No banners available')
      }
    } catch (err) {
      console.error('Error fetching banners:', err)
      setError(err.message || 'Failed to load banners')
      setLoading(false)
      if (fetchAttempts.current === 0) {
        fetchAttempts.current = 1
        setTimeout(() => fetchBanners(true), 3000)
      }
    }
  }, [isMobile])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  // ✅ NEW: Update displayedImage when slide changes
  useEffect(() => {
    if (banners.length === 0) return
    const current = banners[currentSlide]
    const img = isMobile && current.mobileImage ? current.mobileImage : current.desktopImage
    if (img && img !== displayedImage) {
      setDisplayedImage(img)
    }
  }, [currentSlide, banners, isMobile, displayedImage])

  // ✅ Preload the next image (unchanged – works with the new effect)
  useEffect(() => {
    if (banners.length === 0 || !displayedImage) return
    const nextIndex = (currentSlide + 1) % banners.length
    const nextBanner = banners[nextIndex]
    const nextImage = isMobile && nextBanner.mobileImage ? nextBanner.mobileImage : nextBanner.desktopImage
    if (nextImage && nextImage !== displayedImage) {
      const img = new Image()
      img.src = nextImage
    }
  }, [currentSlide, banners, isMobile, displayedImage])

  // ✅ Preload the image when displayedImage changes (unchanged)
  useEffect(() => {
    if (!displayedImage) return
    setImageLoaded(false)
    const img = new Image()
    img.src = displayedImage
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageLoaded(true)
    preloadRef.current = img
  }, [displayedImage])

  // Auto‑play interval (unchanged)
  useEffect(() => {
    if (banners.length <= 1) return
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % banners.length), 5000)
    return () => clearInterval(id)
  }, [banners.length])

  const goToSlide = (index) => setCurrentSlide(index)
  const prev = () => setCurrentSlide((s) => (s - 1 + banners.length) % banners.length)
  const next = () => setCurrentSlide((s) => (s + 1) % banners.length)

  // Skeleton while loading or image not ready
  if (loading || !imageLoaded) {
    return (
      <section className="pt-[72px] md:pt-[80px] pb-2">
        <div className="w-full">
          <div className="bg-gray-200 animate-pulse h-[250px] sm:h-[400px] flex items-center justify-center">
            <FaSpinner className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="pt-[72px] md:pt-[80px] pb-2">
        <div className="w-full">
          <div className="bg-gray-100 h-[250px] sm:h-[400px] flex flex-col items-center justify-center gap-4">
            <p className="text-red-600 text-sm">⚠️ {error}</p>
            <button
              onClick={() => fetchBanners(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaSyncAlt /> Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) return null

  const current = banners[currentSlide]
  const showButton = current.buttonText && current.buttonText.trim().length > 0

  return (
    <section className="pt-[45px] md:pt-[50px] pb-2 w-full">
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ minHeight: '250px', maxHeight: '500px' }}>
          {displayedImage && (
            <img
              src={displayedImage}
              alt={current.title || ''}
              className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{ minHeight: '250px', maxHeight: '500px', opacity: 1 }}
            />
          )}
        </div>

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

        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition z-10"
            >
              <FaChevronLeft size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition z-10"
            >
              <FaChevronRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </>
        )}

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
    </section>
  )
}

export default Hero