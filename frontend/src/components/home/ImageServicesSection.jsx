import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import wmImg from '../../assets/washingmachine.avif'
import fridgeImg from '../../assets/refrigerator.png'
import tvImg from '../../assets/tv repair.jpeg'
import acImg from '../../assets/Ac repair.jpg'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const cardHover = 'hover:-translate-y-[6px] transition-all duration-400 ease-in-out'

const ImageServicesSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-6 md:py-10 bg-[#ece9cb] px-4 sm:px-6">
      <div className="max-w-[1100px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5 md:mb-10">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Our Best Services
          </h2>
          <Link
            to="/services"
            className="inline-flex items-center justify-center bg-white text-black font-semibold py-2 px-5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            View All Services
          </Link>
        </div>

        {/* ── MOBILE asymmetric cards with Book Now button ── */}
        <div className="md:hidden space-y-3">
          <div className="flex gap-3">
            <motion.div
              className={`${cardHover} bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-4 flex flex-col`}
              style={{ width: '65%' }}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 leading-tight">Washing Machine Repair</h3>
              <div className="rounded-xl overflow-hidden mt-auto mb-2">
                <img src={wmImg} alt="Washing Machine Repair" className="w-full h-28 object-cover" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Book Now →
              </button>
            </motion.div>

            <motion.div
              className={`${cardHover} bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-4 flex flex-col`}
              style={{ width: '35%' }}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 leading-tight">Refrigerator Repair</h3>
              <div className="rounded-xl overflow-hidden mt-auto mb-2">
                <img src={fridgeImg} alt="Refrigerator Repair" className="w-full h-28 object-cover" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Book Now →
              </button>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <motion.div
              className={`${cardHover} bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-4 flex flex-col`}
              style={{ width: '35%' }}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 leading-tight">TV Repair</h3>
              <div className="rounded-xl overflow-hidden mt-auto mb-2">
                <img src={tvImg} alt="TV Repair" className="w-full h-28 object-cover" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Book Now →
              </button>
            </motion.div>

            <motion.div
              className={`${cardHover} bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-4 flex flex-col`}
              style={{ width: '65%' }}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 leading-tight">AC Repair</h3>
              <div className="rounded-xl overflow-hidden mt-auto mb-2">
                <img src={acImg} alt="AC Repair" className="w-full h-28 object-cover" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                Book Now →
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── DESKTOP cards with Book Now button ── */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <motion.div
              className={`${cardHover} cursor-pointer bg-white rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col`}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Washing Machine Repair</h3>
              <p className="text-sm text-gray-500 mb-4">Quick and reliable washing machine repair service for your home appliances.</p>
              <div className="rounded-2xl overflow-hidden mt-auto">
                <img src={wmImg} alt="Washing Machine Repair" className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Book Now →
              </button>
            </motion.div>

            <motion.div
              className={`${cardHover} cursor-pointer bg-white rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col relative`}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">👤</div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">460+ workers</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Refrigerator Repair</h3>
              <p className="text-sm text-gray-500 mb-4">Professional refrigerator repair for cooling and performance issues.</p>
              <div className="rounded-2xl overflow-hidden mt-auto">
                <img src={fridgeImg} alt="Refrigerator Repair" className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Book Now →
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-6">
            <motion.div
              className={`${cardHover} cursor-pointer bg-white rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col`}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">TV Repair</h3>
              <p className="text-sm text-gray-500 mb-4">Fast TV repair service with expert technicians for all major brands.</p>
              <div className="rounded-2xl overflow-hidden">
                <img src={tvImg} alt="TV Repair" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Book Now →
              </button>
            </motion.div>

            <motion.div
              className={`${cardHover} cursor-pointer bg-white rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col`}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">AC Repair</h3>
              <p className="text-sm text-gray-500 mb-4">Fast and reliable air conditioner repair for homes and offices.</p>
              <div className="rounded-2xl overflow-hidden mt-auto">
                <img src={acImg} alt="AC Repair" className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <button
                onClick={() => navigate('/book-now')}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Book Now →
              </button>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ImageServicesSection