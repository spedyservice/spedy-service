import React from 'react'
import owner4 from '../../assets/owner image 4.jpeg'

const videoSrc = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_032550_4c49689d-a215-41e0-bb76-8ef78f562429.mp4'

const ExpertSection = () => {
  const titleClass = "text-2xl sm:text-3xl font-bold text-gray-900"

  return (
    <section className="relative py-6 md:py-8 overflow-hidden bg-white">
      {/* Background video – fills entire section, full opacity */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src={videoSrc}
          poster={owner4}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Light overlay to keep text readable – reduced opacity */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="container-custom relative z-10">
        {/* Mobile layout */}
        <div className="md:hidden space-y-4">
          <h2 className={titleClass} style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}>
            Meet Our Technician
          </h2>

          <div>
            <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Centrale Sans', sans-serif" }}>
              Habibur Rahaman Mondal
            </h3>
            <span className="text-base text-blue-600 font-semibold">(Sunny)</span>
            <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mt-1" style={{ fontFamily: "'Centrale Sans', sans-serif" }}>
              Head Technician & Founder
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={owner4} alt="Habibur Rahaman Mondal" className="w-full h-60 object-cover" />
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            With <strong>12+ years of hands‑on experience</strong>, Sunny personally services appliances at your doorstep. From compressors to circuit boards, he’s the expert behind every reliable repair.
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /> Certified Professional</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /> 12+ Years Experience</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /> 5000+ Happy Customers</span>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex items-start gap-6 lg:gap-8">
          <div className="flex-1">
            <h2 className={titleClass} style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}>
              Meet Our Technician
            </h2>

            <div className="mt-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Centrale Sans', sans-serif" }}>
                Habibur Rahaman Mondal
              </h3>
              <span className="text-base text-blue-600 font-semibold">(Sunny)</span>
            </div>

            <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mt-2" style={{ fontFamily: "'Centrale Sans', sans-serif" }}>
              Head Technician & Founder
            </p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-3 max-w-md">
              With <strong>12+ years of hands‑on experience</strong>, Sunny personally services appliances at your doorstep. From compressors to circuit boards, he’s the expert behind every reliable repair.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700 mt-4">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> Certified Professional</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> 12+ Years Experience</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> 5000+ Happy Customers</span>
            </div>
          </div>

          <div className="w-[35%] lg:w-[30%] flex-shrink-0">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={owner4} alt="Habibur Rahaman Mondal" className="w-full h-auto max-h-[360px] object-cover" style={{ maxHeight: '360px' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExpertSection