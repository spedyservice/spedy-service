import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import videoService from '../../services/videoService'

const VideoSection = () => {
  const [videos, setVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)
  const scrollContainerRef = useRef(null)
  const videoRefs = useRef({})       // stores video elements by index

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await videoService.getVideos()
        if (res.success) setVideos(res.data)
      } catch (error) {
        console.error('Failed to fetch videos:', error)
      }
    }
    fetchVideos()
  }, [])

  // Smoothly scroll by one card width + gap
  const scrollByOne = useCallback((direction) => {
    const container = scrollContainerRef.current
    if (!container || container.children.length === 0) return

    const firstCard = container.children[0]
    const cardWidth = firstCard.offsetWidth
    const gap = parseFloat(getComputedStyle(container).gap) || 20

    container.scrollBy({
      left: direction === 'next' ? cardWidth + gap : -(cardWidth + gap),
      behavior: 'smooth',
    })
  }, [])

  // Detect which card is closest to the center (for scroll events)
  const updateActiveFromScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || videos.length === 0) return

    const containerCenter = container.scrollLeft + container.offsetWidth / 2
    let closestIdx = 0
    let minDiff = Infinity

    Array.from(container.children).forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const diff = Math.abs(containerCenter - childCenter)
      if (diff < minDiff) {
        minDiff = diff
        closestIdx = i
      }
    })
    setActiveIndex(prev => (prev !== closestIdx ? closestIdx : prev))
  }, [videos.length])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    container.addEventListener('scroll', updateActiveFromScroll, { passive: true })
    return () => container.removeEventListener('scroll', updateActiveFromScroll)
  }, [updateActiveFromScroll])

  // ── IMPERATIVE PLAY / PAUSE ──
  useEffect(() => {
    // Pause all videos first
    Object.values(videoRefs.current).forEach(el => {
      if (el && typeof el.pause === 'function') el.pause()
    })

    // Determine which video(s) should play
    const indicesToPlay = []
    if (hoverIndex !== null) {
      indicesToPlay.push(hoverIndex)
    } else if (videos.length > 0) {
      indicesToPlay.push(activeIndex)
    }

    indicesToPlay.forEach(idx => {
      const el = videoRefs.current[idx]
      if (el && el.src && typeof el.play === 'function') {
        el.play().catch(() => {})
      }
    })
  }, [activeIndex, hoverIndex, videos.length])

  // Auto‑advance when centered video ends (unless hovering)
  const handleVideoEnded = useCallback(() => {
    if (hoverIndex !== null) return
    if (videos.length === 0) return
    setActiveIndex(prev => {
      const next = (prev + 1) % videos.length
      scrollByOne('next')
      return next
    })
  }, [hoverIndex, videos.length, scrollByOne])

  const goNext = () => {
    if (hoverIndex !== null) setHoverIndex(null)
    setActiveIndex(prev => (prev + 1) % videos.length)
    scrollByOne('next')
  }

  const goPrev = () => {
    if (hoverIndex !== null) setHoverIndex(null)
    setActiveIndex(prev => (prev - 1 + videos.length) % videos.length)
    scrollByOne('prev')
  }

  if (videos.length === 0) return null

  return (
    <section className="py-10 md:py-14 bg-gray-900 text-white overflow-hidden">
      <div className="container-custom">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 text-left"
          style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
        >
          See It to Shop It
        </h2>

        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Previous video"
          >
            <FaChevronLeft size={18} />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video, idx) => {
              const isCenteredActive = (idx === activeIndex) && (hoverIndex === null)
              const isHovered = idx === hoverIndex
              const shouldPlay = isCenteredActive || isHovered

              return (
                <div
                  key={video._id}
                  className={`snap-center flex-shrink-0
                             w-[80vw] sm:w-[50vw] md:w-[28vw] lg:w-[22vw]
                             transition-transform duration-300`}
                  onMouseEnter={() => { if (window.innerWidth >= 768) setHoverIndex(idx) }}
                  onMouseLeave={() => { if (window.innerWidth >= 768) setHoverIndex(null) }}
                >
                  <div className="relative bg-black rounded-xl overflow-hidden shadow-lg aspect-[4/5]">
                    <video
                      ref={el => { videoRefs.current[idx] = el }}
                      src={video.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      loop={isHovered}           // hover previews loop
                      preload="auto"
                      onEnded={isCenteredActive ? handleVideoEnded : undefined}
                    />
                    {/* Dim overlay on non‑playing videos */}
                    {!shouldPlay && (
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Next video"
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default VideoSection