import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube,
  FaWhatsapp, FaPaperPlane
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call - In production, connect to backend contact endpoint
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitting(false)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone Number',
      details: ['+91 98093 37833', '+91 86173 60203'],
      color: 'bg-blue-500',
      action: 'tel:+919809337833'
    },
    {
      icon: FaEnvelope,
      title: 'Email Address',
      details: ['mondalrefrigeration@example.com'],
      color: 'bg-red-500',
      action: 'mailto:mondalrefrigeration@example.com'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Our Location',
      details: ['Your Address Here', 'City, State - PINCODE'],
      color: 'bg-green-500'
    },
    {
      icon: FaClock,
      title: 'Working Hours',
      details: ['Monday - Saturday: 9AM - 8PM', 'Sunday: Closed'],
      color: 'bg-purple-500'
    }
  ]

  const socialLinks = [
    { icon: FaFacebook, href: '#', color: 'bg-[#1877f2]' },
    { icon: FaTwitter, href: '#', color: 'bg-[#1da1f2]' },
    { icon: FaInstagram, href: '#', color: 'bg-[#e4405f]' },
    { icon: FaYoutube, href: '#', color: 'bg-[#cd201f]' },
    { icon: FaWhatsapp, href: 'https://wa.me/919809337833', color: 'bg-[#25d366]' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Contact <span className="text-accent">Us</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help. 
              Reach out to us through any of the following channels.
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.action || '#'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300 block"
              >
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className="text-2xl text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </motion.a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="input-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                
                <div>
                  <label className="input-label">Message *</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe your query or issue..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full inline-flex items-center justify-center space-x-2"
                >
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.27991508165!2d-74.25987584509295!3d40.69767006338157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1641234567890!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Location Map"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Visit Our Service Center</h3>
                  <p className="text-gray-600 text-sm">
                    Our service center is conveniently located with easy access. 
                    Walk in for quick repairs or consultations.
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Connect With Us</h3>
                <div className="flex justify-center space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300`}
                    >
                      <social.icon className="text-white text-xl" />
                    </a>
                  ))}
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                  Follow us for updates, offers, and tips
                </p>
              </div>

              {/* Emergency Contact */}
              <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center animate-pulse">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-accent font-semibold">Emergency Service</p>
                    <p className="text-2xl font-bold">+91 98093 37833</p>
                    <p className="text-xs text-gray-600">Available 24/7 for emergencies</p>
                  </div>
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