import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaPaperPlane, FaCheckCircle
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSent(true)
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-12">
      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}>
              Contact Us
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              Have a question or need assistance? We’re here to help. Reach out anytime.
            </p>
          </div>

          {/* Contact Info Cards – 2 cols on all screens, 4 on large */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {/* Phone */}
            <a
              href="tel:+919609337633"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-600 transition-colors">
                <FaPhone className="text-white text-lg sm:text-xl" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800">Phone</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">+91 96093 37633</p>
              <span className="text-[10px] sm:text-xs text-blue-600 mt-1 font-medium">Tap to call</span>
            </a>

            {/* Email */}
            <a
              href="mailto:spedyservice40@gmail.com"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-600 transition-colors">
                <FaEnvelope className="text-white text-lg sm:text-xl" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800">Email</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 truncate">spedyservice40@gmail.com</p>
              <span className="text-[10px] sm:text-xs text-blue-600 mt-1 font-medium">Send email</span>
            </a>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2">
                <FaMapMarkerAlt className="text-white text-lg sm:text-xl" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800">Address</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 leading-tight">
                Bardhaman Main Road, Kalna, Boher<br className="hidden sm:block" /> West Bengal 713422
              </p>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2">
                <FaClock className="text-white text-lg sm:text-xl" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800">Working Hours</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">24 x 7</p>
              <span className="text-[10px] sm:text-xs text-blue-600 mt-1 font-medium">Always open</span>
            </div>
          </div>

          {/* ══════ Call Now Banner – right after cards ══════ */}
          <div className="bg-blue-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-medium opacity-90">Available 24 x 7 – Call Now</p>
              <p className="text-2xl font-bold">+91 96093 37633</p>
            </div>
            <a
              href="tel:+919609337633"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-5 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-md text-sm"
            >
              <FaPhone size={14} />
              Call Now
            </a>
          </div>

          {/* Main layout: form + map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "'Centrale Sans', sans-serif", fontWeight: 700 }}>
                Send a Message
              </h2>

              {sent && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <div>
                    <p className="font-semibold text-green-800">Message Sent!</p>
                    <p className="text-sm text-green-600">We'll get back to you shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                    placeholder="Describe your query or issue..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                <iframe
                  src="https://maps.google.com/maps?q=Bardhaman+Main+Road+Kalna+Boher+West+Bengal+713422&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Shop Location"
                  className="w-full"
                ></iframe>
                <div className="p-4 flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
                  <span>Bardhaman Main Road, Kalna, Boher, West Bengal 713422</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPage