import React, { useState, useEffect } from 'react'
import brandService from '../../services/brandService'

const BrandsSection = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandService.getAllBrands({ isActive: true })
        if (response.success && response.data.length > 0) {
          setBrands(response.data)
        } else {
          setFallbackBrands()
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
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

  if (loading) {
    return (
      <section className="py-10 bg-gray-500">
        <div className="container-custom text-center">
          <div className="inline-block w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  const marqueeItems = [...brands, ...brands]

  return (
    <section className="py-10 md:py-12 bg-[#eff6cc]">
      <div className="container-custom">
        {/* Header – left aligned, smaller title, no description */}
        <div className="mb-6 md:mb-8 text-left">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Available Brands
          </h2>
        </div>

        {/* Marquee wrapper */}
        <div className="overflow-hidden group">
          <div className="flex gap-6 sm:gap-8 animate-marquee group-hover:[animation-play-state:paused]">
            {marqueeItems.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-200 p-3 sm:p-4 w-32 sm:w-40"
              >
                <BrandLogo brand={brand} />
                <span className="text-xs sm:text-sm font-medium text-gray-700 mt-2 text-center leading-tight whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
          will-change: transform;
        }
      `}</style>
    </section>
  )
}

/**
 * Renders brand logo or initial fallback.
 */
const BrandLogo = ({ brand }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
      {brand.logo && !imgError ? (
        <img
          src={brand.logo}
          alt={brand.name}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg sm:text-xl">
          {brand.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default BrandsSection