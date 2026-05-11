import React from 'react'
import { FaShieldAlt, FaClock, FaMedal, FaTruck } from 'react-icons/fa'

const features = [
  { icon: FaShieldAlt, title: 'Certified Technicians' },
  { icon: FaClock, title: 'Same-Day Service' },
  { icon: FaMedal, title: 'Genuine Products' },
  { icon: FaTruck, title: 'Free Delivery' },
]

const TrustFeatures = () => {
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-3 py-2 sm:py-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-2 py-3 sm:py-4">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-1"
              >
                {/* Blue background, blue icon */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-blue-600 text-xs sm:text-sm" />
                </div>
                <h3 className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustFeatures