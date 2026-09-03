import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFire, FaCheckCircle, FaArrowRight } from 'react-icons/fa'

import acImg from '../../assets/ac repair.webp'
import fridgeImg from '../../assets/fridge repair.webp'
import coolerImg from '../../assets/air cooler.webp'

// Video URL for background
const videoSrc = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_144509_89e2d612-8af2-45c3-90f4-4831bc60715d.mp4'
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const ImageServicesSection = () => {
  const navigate = useNavigate()

  // Font families
  const headingFont = "'Lato', 'Open Sans', sans-serif"
  const bodyFont = "'Open Sans', 'Lato', sans-serif"
  const accentFont = "'Playfair Display', serif"

  return (
    <section className="w-full relative overflow-hidden py-12 md:py-20 bg-black">
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

      {/* Decorative radials (softened for video) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#0142b7]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 bg-[#d4e0fd]/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-32 w-96 h-96 bg-[#dbe1ff]/15 rounded-full blur-3xl" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-12 relative z-10">
        {/* ── Header (smaller size) ── */}
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <h2
            className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-lg"
            style={{ fontFamily: headingFont }}
          >
            Our Best Services
            <span className="text-[#0b1fb8] ml-2" style={{ fontFamily: accentFont }}>✦</span>
          </h2>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-white/90 hover:text-[#0b36b8] font-semibold text-sm md:text-base border-b-2 border-transparent hover:border-[#0b25b8] transition-all duration-300 group"
            style={{ fontFamily: bodyFont }}
          >
            View All
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden space-y-4">
          {/* AC & Fridge – side by side 50/50 */}
          <div className="flex gap-4">
            {/* AC Card */}
            <motion.div
              className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative h-36 overflow-hidden">
                <img src={acImg} alt="AC Service" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0142b7] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  <FaFire className="text-[10px]" /> Popular
                </span>
              </div>
              <div className="p-3 flex flex-col">
                <h4
                  className="text-sm font-bold text-white mb-1 tracking-tight drop-shadow"
                  style={{ fontFamily: headingFont, fontWeight: 900 }}
                >
                  AC Service & Repair
                </h4>
                <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2 drop-shadow" style={{ fontFamily: bodyFont }}>
                  Cooling diagnostics, deep foam jet cleaning, gas charging, leak repairs, and complete installation.
                </p>
                <button
                  onClick={() => navigate('/book-now')}
                  className="mt-2 w-full bg-[#0142b7] hover:bg-[#003dab] text-white py-1.5 rounded-lg text-xs font-semibold transition shadow-md"
                  style={{ fontFamily: bodyFont }}
                >
                  Book Now →
                </button>
              </div>
            </motion.div>

            {/* Fridge Card */}
            <motion.div
              className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative h-36 overflow-hidden">
                <img src={fridgeImg} alt="Fridge Service" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold border border-white/30 shadow-sm uppercase tracking-wider">
                  Cooling Care
                </span>
              </div>
              <div className="p-3 flex flex-col">
                <h4
                  className="text-sm font-bold text-white mb-1 tracking-tight drop-shadow"
                  style={{ fontFamily: headingFont, fontWeight: 900 }}
                >
                  Refrigerator Service
                </h4>
                <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2 drop-shadow" style={{ fontFamily: bodyFont }}>
                  Compressor diagnostics, cooling coil fixes, gas refilling, thermostat sensor repair.
                </p>
                <button
                  onClick={() => navigate('/book-now')}
                  className="mt-2 w-full bg-[#0142b7] hover:bg-[#003dab] text-white py-1.5 rounded-lg text-xs font-semibold transition shadow-md"
                  style={{ fontFamily: bodyFont }}
                >
                  Book Now →
                </button>
              </div>
            </motion.div>
          </div>

          {/* Air Cooler – horizontal card */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-row"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="w-1/3 min-h-[120px] overflow-hidden">
              <img src={coolerImg} alt="Air Cooler Service" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-emerald-500/30 uppercase tracking-wider">
                  <span>🌿</span> Eco‑Friendly
                </span>
                <h4
                  className="text-sm font-bold text-white mt-1 tracking-tight drop-shadow"
                  style={{ fontFamily: headingFont, fontWeight: 900 }}
                >
                  Air Cooler Service
                </h4>
                <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2 drop-shadow" style={{ fontFamily: bodyFont }}>
                  Motor rewinding, honeycomb pad replacement, submersible pump descaling, deep tank disinfection.
                </p>
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-2 w-full bg-[#0142b7] hover:bg-[#003dab] text-white py-1.5 rounded-lg text-xs font-semibold transition shadow-md"
                style={{ fontFamily: bodyFont }}
              >
                Book Now →
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:grid grid-cols-12 gap-6">
          {/* AC – spans 8, featured */}
          <motion.div
            className="md:col-span-8 group bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto min-h-[300px]">
              <img src={acImg} alt="AC Service & Repair" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0142b7] text-white text-xs font-bold shadow-md tracking-wider uppercase">
                  <FaFire className="text-xs" /> Most Popular
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[#170bb8] bg-white/20 px-3 py-1 rounded-md text-xs font-semibold border border-[#b8860b]/30 uppercase tracking-wider backdrop-blur-sm">
                    <FaCheckCircle className="text-xs" /> Verified Master Technicians
                  </span>
                </div>
                <h3
                  className="text-2xl font-black text-white mb-2 group-hover:text-[#0b1cb8] transition-colors tracking-tight drop-shadow"
                  style={{ fontFamily: headingFont }}
                >
                  AC Service & Repair
                </h3>
                <p className="text-sm text-white/80 mb-4 leading-relaxed tracking-wide drop-shadow" style={{ fontFamily: bodyFont }}>
                  Cooling diagnostics, deep foam jet cleaning, gas charging, leak repairs, and complete uninstallation/installation.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/90 tracking-wide" style={{ fontFamily: bodyFont }}>
                    • Deep Jet Foam Clean
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/90 tracking-wide" style={{ fontFamily: bodyFont }}>
                    • Gas Leak Check
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/90 tracking-wide" style={{ fontFamily: bodyFont }}>
                    • 30-Day Protection
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-4 w-full md:w-auto self-end bg-[#0142b7] hover:bg-[#003dab] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ fontFamily: bodyFont }}
              >
                Book Now →
              </button>
            </div>
          </motion.div>

          {/* Fridge – spans 4 */}
          <motion.div
            className="md:col-span-4 group bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="relative overflow-hidden h-56">
              <img src={fridgeImg} alt="Refrigerator Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30 shadow-sm uppercase tracking-wider">Cooling Care</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1 drop-shadow" style={{ fontFamily: bodyFont }}>Single & Double Door</span>
              <h3
                className="text-xl font-black text-white mb-2 group-hover:text-[#b8860b] transition-colors tracking-tight drop-shadow"
                style={{ fontFamily: headingFont }}
              >
                Refrigerator Service
              </h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed flex-grow tracking-wide drop-shadow" style={{ fontFamily: bodyFont }}>
                Comprehensive compressor diagnostics, cooling coil fixes, gas refilling, and thermostat sensor repair.
              </p>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-2 w-full bg-[#0142b7] hover:bg-[#003dab] text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: bodyFont }}
              >
                Book Now →
              </button>
            </div>
          </motion.div>

          {/* Air Cooler – spans 12, horizontal */}
          <motion.div
            className="md:col-span-12 group bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto min-h-[220px]">
              <img src={coolerImg} alt="Air Cooler Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30 shadow-sm uppercase tracking-wider">Eco Cooling</span>
              </div>
            </div>
            <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-900/50 px-2.5 py-0.5 rounded-md text-xs font-semibold border border-emerald-500/30 uppercase tracking-wider backdrop-blur-sm">
                    <span>🌿</span> Eco-Friendly Overhaul
                  </span>
                  <span className="text-xs font-semibold text-white/70 tracking-wide drop-shadow" style={{ fontFamily: bodyFont }}>Desert & Personal Coolers</span>
                </div>
                <h3
                  className="text-2xl font-black text-white mb-2 group-hover:text-[#b8860b] transition-colors tracking-tight drop-shadow"
                  style={{ fontFamily: headingFont }}
                >
                  Air Cooler Service
                </h3>
                <p className="text-sm text-white/80 mb-4 leading-relaxed tracking-wide drop-shadow" style={{ fontFamily: bodyFont }}>
                  Motor rewinding, honeycomb pad replacement, submersible pump descaling, deep tank disinfection, and seasonal pre-summer tune-ups.
                </p>
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-4 w-full md:w-auto self-end bg-[#0142b7] hover:bg-[#003dab] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ fontFamily: bodyFont }}
              >
                Book Now →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ImageServicesSection