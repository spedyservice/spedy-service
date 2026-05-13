import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaFacebookF, FaInstagram, FaTwitter, FaYoutube,
  FaArrowRight, FaBolt
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a] to-[#05080f] text-white pt-16 sm:pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

          {/* ── Brand column ── */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <FaBolt className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  Spedy <span className="text-blue-400">Service</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Repair &amp; Sales Center</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted partner for fast, reliable appliance repair and genuine products. Expert technicians, original parts, and free delivery on all orders.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebookF, href: '#' },
                { icon: FaInstagram, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaYoutube, href: '#' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-9 h-9 bg-white/5 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
                >
                  <item.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-base font-bold mb-5 text-blue-400 uppercase tracking-wide text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/shop', label: 'Shop' },
                { to: '/book-now', label: 'Book Now' },
                { to: '/contact', label: 'Contact' },
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/my-orders', label: 'My Orders' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="text-blue-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1 group-hover:translate-x-0 transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services & Products ── */}
          <div>
            <h3 className="text-base font-bold mb-5 text-blue-400 uppercase tracking-wide text-sm">What We Fix</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-400">
              <span>Washing Machine</span>
              <span>Air Conditioner</span>
              <span>Refrigerator</span>
              <span>LED/LCD TV</span>
              <span>Microwave</span>
              <span>Water Purifier</span>
              <span>Induction</span>
              <span>Geyser</span>
              <span>Chimney</span>
              <span>Cooler</span>
              <span>Oven</span>
              <span>Home Theatre</span>
            </div>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-base font-bold mb-5 text-blue-400 uppercase tracking-wide text-sm">Get In Touch</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaPhone className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>+91 96093 37633</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-blue-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:spedyservice40@gmail.com" className="hover:text-blue-400 transition-colors break-all">
                  spedyservice40@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p>Bardhaman Main Road, Kalna, Boher, West Bengal 713422</p>
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-blue-500 flex-shrink-0" />
                <p>24 x 7 – Always Open</p>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center text-xs text-gray-500">
          <p>&copy; {currentYear} Spedy Service. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer