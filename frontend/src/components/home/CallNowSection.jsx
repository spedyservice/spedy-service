import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const CallNowSection = () => {
  const phoneNumber = '+919609337633'

  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-blue-700 to-blue-800">
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
          <p className="text-white/90 text-sm md:text-base font-bold uppercase tracking-wide mb-2">
            To book a service, call now
          </p>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {phoneNumber}
          </h3>
          <a
            href={`tel:${phoneNumber.replace(/\D/g, '')}`}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition-colors text-sm md:text-base"
          >
            <FaPhoneAlt size={14} />
            Call Now
          </a>
        </div>
      </div>
    </section>
  )
}

export default CallNowSection