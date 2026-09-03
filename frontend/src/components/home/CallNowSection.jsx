import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const videoSrc = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4'

const CallNowSection = () => {
  const phoneNumber = '+919609337633'

  return (
    <section className="relative py-8 md:py-12 overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
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