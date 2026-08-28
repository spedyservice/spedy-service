import React, { useState, useEffect } from 'react'
import brandService from '../../services/brandService'

const BrandsSection = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandService.getAllBrands({ isActive: true })
        console.log('✅ Brands fetched:', response)
        if (response.success && response.data.length > 0) {
          setBrands(response.data)
        } else {
          setFallbackBrands()
        }
      } catch (error) {
        console.error('❌ Error fetching brands:', error)
        setFallbackBrands()
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  const setFallbackBrands = () => {
    const fallbackNames = [
      'Samsung', 'LG', 'Sony', 'Whirlpool', 'Godrej', 'Bosch',
      'IFB', 'Daikin', 'Blue Star', 'Croma', 'Panasonic', 'Haier',
      'Voltas', 'Hitachi', 'Carrier', 'Mitsubishi', 'Philips', 'Bajaj'
    ]
    setBrands(fallbackNames.map(name => ({ name, logo: '' })))
  }

  const marqueeItems = [...brands, ...brands]

  if (loading) {
    return (
      <section className="w-full bg-[#000000] py-[80px] flex justify-center items-center">
        <div className="inline-block w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </section>
    )
  }

  if (brands.length === 0) return null

  return (
    <section className="w-full bg-[#000000] py-[80px] overflow-hidden select-none relative">
      <div className="max-w-[1200px] mx-auto relative z-10 px-4">
        <h2
          className="text-[#FFFFFF] text-center text-[18px] font-medium leading-[140%] mb-[60px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Trusted by 90+ Brands
        </h2>

        <div className="marquee-container relative flex overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="marquee-content flex shrink-0 gap-[80px] min-w-full">
            {marqueeItems.map((brand, index) => {
              const hasLogo = brand.logo && brand.logo.trim() !== ''
              return (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  {hasLogo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-[32px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const parent = e.target.parentElement
                        const fallback = document.createElement('span')
                        fallback.className = 'text-white text-base font-medium opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer whitespace-nowrap'
                        fallback.textContent = brand.name
                        parent.appendChild(fallback)
                      }}
                    />
                  ) : (
                    <span className="text-white text-base font-medium opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer whitespace-nowrap">
                      {brand.name}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 40px)); }
        }
        .marquee-content {
          animation: marquee-scroll 30s linear infinite;
          will-change: transform;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-content {
            gap: 40px;
          }
          .marquee-content {
            animation-duration: 20s;
          }
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-50% - 20px)); }
          }
        }
      `}</style>
    </section>
  )
}

export default BrandsSection