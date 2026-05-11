import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaCalendarCheck, FaShoppingBag, FaTools, FaArrowRight } from 'react-icons/fa'

/*
  ⚠️ IMPORTANT: To use "Centrale Sans 700", you must add this to your index.html or global CSS:
  <link href="https://fonts.googleapis.com/css2?family=Centrale+Sans:wght@700&display=swap" rel="stylesheet">
  (Check availability – if not on Google Fonts, use your own @font-face declaration)
*/

const steps = [
  {
    number: '1',
    title: 'Choose Your Service or Product',
    description: 'Select from our repair services or browse our online shop for genuine appliances and parts.',
    icon: FaShoppingBag,
    highlights: ['Repair & installation', 'Shop appliances', 'Genuine parts'],
  },
  {
    number: '2',
    title: 'Book or Buy Online',
    description: 'Schedule a repair visit with your preferred date and time, or place an order for quick delivery.',
    icon: FaCalendarCheck,
    highlights: ['Instant confirmation', 'Track your booking/order', 'Reschedule anytime'],
  },
  {
    number: '3',
    title: 'We Deliver & Repair',
    description: 'Our certified technicians arrive on time for repairs, or your order is delivered to your doorstep.',
    icon: FaTools,
    highlights: ['Doorstep service & delivery', '90-day warranty', 'Pay after service/on delivery'],
  },
]

const HowItWorks = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* ── Header: left title, right button ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 md:mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
          >
            How It Works
          </h2>
          <Link
            to="/book-now"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-md hover:bg-gray-800 transition-colors shadow-sm"
          >
            <FaCalendarCheck size={14} />
            Book a Service Now
            <FaArrowRight size={12} />
          </Link>
        </div>

        {/* ── Steps Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-gray-100 rounded-lg p-6 md:p-7 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                {/* Large watermark number */}
                <span className="absolute top-4 right-5 text-6xl md:text-7xl font-bold text-gray-50 select-none leading-none">
                  {step.number}
                </span>

                {/* Icon (clean, no background) */}
                <div className="relative z-10 mb-5">
                  <Icon className="text-gray-700 text-2xl" />
                </div>

                {/* Title and description */}
                <div className="relative z-10">
                  <h3
                    className="text-lg font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {step.description}
                  </p>
                </div>

                {/* Highlights (subtle bullets) */}
                <ul className="space-y-1.5 relative z-10">
                  {step.highlights.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks