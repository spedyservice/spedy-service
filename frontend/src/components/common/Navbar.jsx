import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FaHome, FaWrench, FaCalendarAlt, FaEnvelope,
  FaUser, FaSignOutAlt, FaBars, FaTimes,
  FaUserPlus,
  FaChevronDown, FaMapMarkerAlt, FaKey,
  FaClipboardList, FaTachometerAlt, FaPhone,
  FaShoppingBag, FaShoppingCart, FaSearch
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import cartService from '../../services/cartService'

// ── Extracted UserDropdown (stable component reference) ──
const UserDropdown = ({ user, isAdmin, onLogout, onClose }) => {
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]"
    >
      <div className="px-4 py-4 flex items-center gap-3">
        {user?.avatar ? (
          <img src={user.avatar} alt="" className="w-11 h-11 rounded-full" />
        ) : (
          <div className="w-11 h-11 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {getInitials(user?.name)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <div className="border-t border-gray-100" />
      <div className="py-2">
        {!isAdmin ? (
          <>
            <Link to="/my-bookings" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaClipboardList className="text-gray-500"/> <span className="text-sm">My Bookings</span></Link>
            <Link to="/my-orders" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaShoppingBag className="text-gray-500"/> <span className="text-sm">My Orders</span></Link>
            <Link to="/cart" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaShoppingCart className="text-gray-500"/> <span className="text-sm">My Cart</span></Link>
            <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaUser className="text-gray-500"/> <span className="text-sm">My Profile</span></Link>
            <Link to="/profile?tab=address" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaMapMarkerAlt className="text-gray-500"/> <span className="text-sm">Saved Address</span></Link>
            <Link to="/profile?tab=password" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaKey className="text-gray-500"/> <span className="text-sm">Change Password</span></Link>
          </>
        ) : (
          <Link to="/admin" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"><FaTachometerAlt className="text-gray-500"/> <span className="text-sm">Dashboard</span></Link>
        )}
      </div>
      <div className="border-t border-gray-100" />
      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left"><FaSignOutAlt className="text-red-500"/> <span className="text-sm font-medium text-red-600">Logout</span></button>
    </motion.div>
  )
}

// ── Navbar component ──
const topBarMessages = [
  'Free shipping on orders above ₹1000',
  'Genuine Products | GST Billing | Express Delivery',
  'Track your order anytime',
  '30-Day Service Warranty on all repairs',
]

const Navbar = () => {
  const { user, isAdmin, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileDropdownRef = useRef(null)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // ---------- Cart count ----------
  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) { setCartCount(0); return }
    try {
      const res = await cartService.getCart()
      if (res.success) {
        const total = res.data.items.reduce((s, i) => s + i.quantity, 0)
        setCartCount(total)
      }
    } catch { setCartCount(0) }
  }, [isAuthenticated])

  useEffect(() => { fetchCartCount() }, [location.pathname, isAuthenticated, fetchCartCount])

  useEffect(() => {
    const h = () => fetchCartCount()
    window.addEventListener('cartUpdated', h)
    return () => window.removeEventListener('cartUpdated', h)
  }, [fetchCartCount])

  // Close desktop dropdown
  useEffect(() => {
    const cb = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false) }
    document.addEventListener('mousedown', cb)
    return () => document.removeEventListener('mousedown', cb)
  }, [])

  // Close mobile dropdown
  useEffect(() => {
    const cb = (e) => { if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) setIsMobileDropdownOpen(false) }
    document.addEventListener('mousedown', cb)
    return () => document.removeEventListener('mousedown', cb)
  }, [])

  useEffect(() => { setIsDropdownOpen(false); setIsOpen(false); setIsMobileDropdownOpen(false); setShowMobileSearch(false) }, [location.pathname])

  // ---------- Scroll detection for glass effect ----------
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ---------- Rotating top‑bar messages ----------
  useEffect(() => {
    const id = setInterval(() => setMsgIndex(m => (m + 1) % topBarMessages.length), 4000)
    return () => clearInterval(id)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
    setIsDropdownOpen(false)
    setIsMobileDropdownOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowMobileSearch(false)
    }
  }

  // ✅ Changed "Shop" to "Sells" in navigation links
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Sells' },      // renamed
    { to: '/book-now', label: 'Book Now' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      {/* ── TOP MINI BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a1a2f] text-white text-xs sm:text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-3">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="tracking-wide font-medium text-center"
          >
            {topBarMessages[msgIndex]}
          </motion.span>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <div
        className={`fixed top-7 left-0 right-0 z-40 transition-all duration-300 border-b ${
          scrollY > 20
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-gray-200'
            : 'bg-white border-gray-100 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-4">

          {/* ═══════ Mobile layout ═══════ */}
          <div className="flex lg:hidden items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaSearch size={18} />
              </button>
            </div>

            <div className="flex-1 flex justify-center">
              <Link to="/">
                <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
                  Spedy <span className="text-blue-900">Service</span>
                </h1>
              </Link>
            </div>

            <div className="flex items-center justify-end gap-2">
              {isAuthenticated ? (
                <div className="relative" ref={mobileDropdownRef}>
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {isMobileDropdownOpen && (
                      <UserDropdown
                        user={user}
                        isAdmin={isAdmin}
                        onLogout={handleLogout}
                        onClose={() => setIsMobileDropdownOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaUser size={18} />
                </Link>
              )}
              <Link to="/cart" className="relative p-1.5 text-gray-700 hover:text-blue-600 transition-colors">
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ═══════ Desktop layout ═══════ */}
          <div className="hidden lg:flex items-center justify-between py-3 sm:py-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
                Spedy <span className="text-blue-900">Service</span>
              </h1>
            </Link>

            <nav className="flex items-center gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-semibold transition-colors duration-200 relative py-1 ${
                      active
                        ? 'text-blue-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700'
                        : 'text-gray-700 hover:text-blue-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {isAuthenticated && !isAdmin && (
                <Link
                  to="/my-bookings"
                  className={`text-sm font-semibold transition-colors duration-200 relative py-1 ${
                    isActive('/my-bookings')
                      ? 'text-blue-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700'
                      : 'text-gray-700 hover:text-blue-700'
                  }`}
                >
                  My Bookings
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-sm font-semibold transition-colors duration-200 relative py-1 ${
                    isActive('/admin')
                      ? 'text-blue-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700'
                      : 'text-gray-700 hover:text-blue-700'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-3 py-2">
                <FaSearch className="text-gray-400 text-xs mr-2" />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-28 lg:w-40 text-gray-700 placeholder-gray-400"
                />
              </form>

              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-semibold text-gray-800">{user?.name?.split(' ')[0]}</span>
                    <FaChevronDown className={`text-gray-400 text-xs transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <UserDropdown
                        user={user}
                        isAdmin={isAdmin}
                        onLogout={handleLogout}
                        onClose={() => setIsDropdownOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-blue-700">Login</Link>
                  <Link to="/register" className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-blue-700">Sign Up</Link>
                </>
              )}

              <Link to="/book-now" className="hidden sm:inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-700 shadow-sm transition">
                <FaPhone className="text-[10px]"/> Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile search input */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200 px-4 py-2"
            >
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-3 py-2">
                <FaSearch className="text-gray-400 text-xs mr-2" />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE MENU (no gap) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white overflow-y-auto lg:hidden"
            style={{ top: '84px' }}
          >
            <div className="px-5 py-6">
              <div className="flex flex-col gap-1.5 mb-6">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold transition-all ${isActive(link.to) ? 'bg-blue-700 text-white' : 'text-gray-800 hover:bg-gray-50'}`}
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50">
                  <FaShoppingCart className="text-lg text-gray-500"/> Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                {isAuthenticated && !isAdmin && (
                  <>
                    <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50"><FaClipboardList className="text-lg text-blue-600"/> My Bookings</Link>
                    <Link to="/my-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50"><FaShoppingBag className="text-lg text-blue-600"/> My Orders</Link>
                  </>
                )}
                {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50">Dashboard</Link>}
              </div>
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-5 space-y-3">
                  <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-xl">
                    {user?.avatar ? <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" /> :
                      <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">{getInitials(user?.name)}</div>}
                    <div><p className="font-bold text-gray-800 text-base">{user?.name}</p><p className="text-sm text-gray-500">{user?.email}</p></div>
                  </div>
                  {!isAdmin && (
                    <>
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50"><FaUser className="text-gray-500 text-lg"/> <span className="font-bold text-gray-800 text-sm">My Profile</span></Link>
                      <Link to="/profile?tab=address" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50"><FaMapMarkerAlt className="text-gray-500 text-lg"/> <span className="font-bold text-gray-800 text-sm">Saved Address</span></Link>
                      <Link to="/profile?tab=password" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50"><FaKey className="text-gray-500 text-lg"/> <span className="font-bold text-gray-800 text-sm">Change Password</span></Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 text-sm"><FaSignOutAlt className="text-lg"/> Logout</button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-5 space-y-2.5">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white text-sm"><FaUser className="text-lg"/> Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-sm"><FaUserPlus className="text-lg"/> Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar