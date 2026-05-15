import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  FaTv, FaSnowflake, FaWind, FaTshirt, FaMicrophoneAlt, 
  FaFire, FaTint, FaUtensils, FaFan, FaCheckCircle,
  FaArrowLeft, FaArrowRight, FaCalendarAlt, FaClock,
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner,
  FaSearch, FaHome, FaLaptop, FaPrint, FaHeadphones, FaPlug, FaDesktop, FaGamepad,
  FaTools, FaWrench
} from 'react-icons/fa'
import bookingService from '../services/bookingService'
import brandService from '../services/brandService'
import serviceService from '../services/serviceService'
import { useAuth } from '../context/AuthContext'

// ---------- helpers (unchanged) ----------
const getIconForCategory = (categoryName) => {
  const name = categoryName.toLowerCase()
  if (name.includes('tv') || name.includes('led') || name.includes('lcd')) return FaTv
  if (name.includes('ac') || name.includes('air conditioner')) return FaWind
  if (name.includes('fridge') || name.includes('refrigerator')) return FaSnowflake
  if (name.includes('washing') || name.includes('washer')) return FaTshirt
  if (name.includes('microwave')) return FaMicrophoneAlt
  if (name.includes('induction')) return FaFire
  if (name.includes('geyser') || name.includes('water heater')) return FaTint
  if (name.includes('purifier')) return FaTint
  if (name.includes('mixer')) return FaUtensils
  if (name.includes('chimney') || name.includes('exhaust')) return FaFan
  if (name.includes('heater') && !name.includes('water')) return FaFire
  if (name.includes('fan')) return FaFan
  if (name.includes('cooler')) return FaFan
  if (name.includes('home theatre') || name.includes('sound')) return FaHeadphones
  if (name.includes('laptop') || name.includes('desktop') || name.includes('computer')) return FaLaptop
  if (name.includes('printer')) return FaPrint
  if (name.includes('blender')) return FaTint
  if (name.includes('coffee')) return FaTint
  if (name.includes('iron')) return FaPlug
  if (name.includes('vacuum')) return FaPlug
  if (name.includes('game')) return FaGamepad
  if (name.includes('other')) return FaHome
  return FaTv
}

const getColorForCategory = (categoryName) => {
  const name = categoryName.toLowerCase()
  if (name.includes('tv')) return 'bg-blue-500'
  if (name.includes('ac')) return 'bg-cyan-500'
  if (name.includes('fridge')) return 'bg-sky-500'
  if (name.includes('washing')) return 'bg-indigo-500'
  if (name.includes('microwave')) return 'bg-purple-500'
  if (name.includes('induction')) return 'bg-blue-500'
  if (name.includes('geyser')) return 'bg-red-500'
  if (name.includes('purifier')) return 'bg-teal-500'
  if (name.includes('mixer')) return 'bg-emerald-500'
  if (name.includes('chimney') || name.includes('exhaust')) return 'bg-gray-500'
  if (name.includes('heater')) return 'bg-orange-600'
  if (name.includes('fan')) return 'bg-gray-600'
  if (name.includes('cooler')) return 'bg-sky-600'
  if (name.includes('home theatre')) return 'bg-purple-600'
  if (name.includes('laptop') || name.includes('computer')) return 'bg-blue-700'
  if (name.includes('printer')) return 'bg-green-700'
  if (name.includes('other')) return 'bg-gray-500'
  return 'bg-blue-500'
}

const installableProducts = [
  'Air Conditioner (AC)',
  'Refrigerator',
  'Washing Machine',
  'Geyser',
  'Water Heater',
  'Chimney',
  'Dishwasher',
  'Microwave Oven'
]

// Helper to load saved data only if it belongs to current user
const loadSavedData = (currentUserEmail) => {
  const saved = localStorage.getItem('bookingFormData')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // If the saved data has a userEmail and it doesn't match current user, ignore it
      if (parsed.userEmail && parsed.userEmail !== currentUserEmail) {
        return null
      }
      return {
        formData: {
          productCategory: parsed.productCategory || '',
          serviceType: parsed.serviceType || 'repair',
          brandName: parsed.brandName || '',
          issueDescription: parsed.issueDescription || '',
          customerName: parsed.customerName || '',
          phone: parsed.phone || '',
          email: parsed.email || '',
          address: parsed.address || '',
          pincode: parsed.pincode || '',
          preferredDate: parsed.preferredDate || '',
          timeSlot: parsed.timeSlot || ''
        },
        currentStep: parsed.currentStep || 1,
        isOtherCategory: parsed.productCategory === 'Other Electronics',
        customCategory: parsed.customCategory || ''
      }
    } catch (e) {}
  }
  return null
}

const BookNowPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Load saved data only if it matches current user email
  const saved = user?.email ? loadSavedData(user.email) : null

  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [isOtherCategory, setIsOtherCategory] = useState(saved?.isOtherCategory || false)
  const [customCategory, setCustomCategory] = useState(saved?.customCategory || '')
  const [formData, setFormData] = useState(saved?.formData || {
    productCategory: '',
    serviceType: 'repair',
    brandName: '',
    issueDescription: '',
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    pincode: '',
    preferredDate: '',
    timeSlot: ''
  })
  const [currentStep, setCurrentStep] = useState(saved?.currentStep || 1)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/book-now', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Whenever the logged-in user changes, clear the saved form data and reset to current user's details
  useEffect(() => {
    if (user && user.email) {
      // Clear localStorage saved data belonging to any user
      localStorage.removeItem('bookingFormData')
      // Reset form to current user's info
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }))
      setCurrentStep(1)
      setIsOtherCategory(false)
      setCustomCategory('')
    }
  }, [user?.email]) // Run only when user email changes (i.e., different user logged in)

  // Save to localStorage on every change, but now we also store the user email
  useEffect(() => {
    if (user?.email) {
      const dataToSave = { 
        ...formData, 
        currentStep, 
        customCategory,
        userEmail: user.email // store which user this data belongs to
      }
      localStorage.setItem('bookingFormData', JSON.stringify(dataToSave))
    }
  }, [formData, currentStep, customCategory, user?.email])

  const timeSlots = [
    { id: '9:00 AM - 11:00 AM', name: 'Morning 9-11', period: 'Morning' },
    { id: '11:00 AM - 1:00 PM', name: 'Late Morning 11-1', period: 'Morning' },
    { id: '1:00 PM - 3:00 PM', name: 'Afternoon 1-3', period: 'Afternoon' },
    { id: '3:00 PM - 5:00 PM', name: 'Late Afternoon 3-5', period: 'Afternoon' },
    { id: '5:00 PM - 7:00 PM', name: 'Evening 5-7', period: 'Evening' }
  ]

  const commonIssues = [
    'Not working at all',
    'Not cooling/heating properly',
    'Strange noise',
    'Leakage problem',
    'Display not working',
    'Power issue',
    'Button not responding',
    'Other'
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [brandsRes, servicesRes] = await Promise.all([
          brandService.getAllBrands({ isActive: true }),
          serviceService.getAllServices({ isActive: true })
        ])
        if (brandsRes.success) setBrands(brandsRes.data)
        if (servicesRes.success) {
          const sorted = [...servicesRes.data].sort((a, b) => {
            if (a.name === 'Other Electronics') return 1
            if (b.name === 'Other Electronics') return -1
            return a.name.localeCompare(b.name)
          })
          setCategories(sorted)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'productCategory') {
      setIsOtherCategory(value === 'Other Electronics')
      if (value !== 'Other Electronics') setCustomCategory('')
    }
  }

  const selectedProductSupportsInstallation = () => {
    const product = formData.productCategory
    if (!product) return false
    return installableProducts.some(p => product.toLowerCase().includes(p.toLowerCase()))
  }

  const needsIssueDescription = () => {
    if (!selectedProductSupportsInstallation()) return true
    return formData.serviceType === 'repair'
  }

  const getTotalSteps = () => {
    let steps = 1
    if (selectedProductSupportsInstallation()) steps++
    steps++
    if (needsIssueDescription()) steps++
    steps++
    steps++
    steps++
    return steps
  }

  useEffect(() => {
    const total = getTotalSteps()
    if (currentStep > total) setCurrentStep(total)
    if (currentStep < 1) setCurrentStep(1)
  }, [formData.productCategory, formData.serviceType, currentStep])

  const isStepValid = (step) => {
    let s = 1
    if (step === s++) {
      return isOtherCategory ? customCategory.trim() !== '' : formData.productCategory !== ''
    }
    if (selectedProductSupportsInstallation() && step === s++) {
      return true
    }
    if (step === s++) {
      return formData.brandName !== ''
    }
    if (needsIssueDescription() && step === s++) {
      return formData.issueDescription !== ''
    }
    if (step === s++) {
      return formData.customerName && formData.phone && formData.email && formData.address && formData.pincode
    }
    if (step === s++) {
      return formData.preferredDate && formData.timeSlot
    }
    return true
  }

  const canGoToStep = (targetStep) => {
    for (let i = 1; i < targetStep; i++) {
      if (!isStepValid(i)) return false
    }
    return true
  }

  const nextStep = () => {
    const total = getTotalSteps()
    if (currentStep < total && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      toast.error('Please complete the current step first.')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (step) => {
    if (canGoToStep(step)) {
      setCurrentStep(step)
      window.scrollTo(0, 0)
    } else {
      toast.error('Please complete the previous steps first.')
    }
  }

  const handleSubmit = async () => {
    if (!isStepValid(getTotalSteps())) {
      toast.error('Please complete all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const finalData = { ...formData }

      if (isOtherCategory && customCategory.trim()) {
        finalData.productCategory = customCategory.trim()
      }

      if (!needsIssueDescription() && !finalData.issueDescription.trim()) {
        finalData.issueDescription = 'Installation requested'
      }

      finalData.phone = finalData.phone.replace(/\D/g, '').slice(0, 10)
      finalData.pincode = finalData.pincode.replace(/\D/g, '').slice(0, 6)

      const response = await bookingService.createBooking(finalData)
      if (response.success) {
        toast.success('Booking created successfully!')
        localStorage.removeItem('bookingFormData')
        navigate('/my-bookings')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // --- Step rendering components (unchanged) ---
  const renderStepIndicator = () => {
    const total = getTotalSteps()
    const stepsArray = Array.from({ length: total }, (_, i) => i + 1)
    return (
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="flex items-center gap-1 md:gap-3">
          {stepsArray.map((step) => (
            <React.Fragment key={step}>
              <button
                onClick={() => goToStep(step)}
                disabled={!canGoToStep(step) && step !== currentStep}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                } ${(!canGoToStep(step) && step !== currentStep) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentStep > step ? <FaCheckCircle className="text-white text-xs md:text-sm" /> : step}
              </button>
              {step < total && (
                <div className={`w-4 md:w-8 h-0.5 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Select Product Category</h2>
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:border-blue-500 outline-none text-sm" />
      </div>
      {loading ? (
        <div className="text-center py-8"><FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" /><p className="text-gray-500">Loading categories...</p></div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-8"><p className="text-gray-500">No categories found.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredCategories.map((category) => {
            const Icon = getIconForCategory(category.name)
            const colorClass = getColorForCategory(category.name)
            const isSelected = formData.productCategory === category.name && !isOtherCategory
            return (
              <button key={category._id} onClick={() => updateFormData('productCategory', category.name)} className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="text-white text-lg md:text-xl" />
                </div>
                <p className={`text-xs md:text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{category.name}</p>
              </button>
            )
          })}
        </div>
      )}
      {isOtherCategory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <input type="text" placeholder="Please specify your appliance/device" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none text-sm" />
          <p className="text-xs text-gray-500 mt-1">Enter the name of your appliance</p>
        </div>
      )}
    </motion.div>
  )

  const renderStep2 = () => {
    if (!selectedProductSupportsInstallation()) {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Service Type</h2>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <FaTools className="text-blue-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-700">This product only requires <span className="font-semibold">Repair</span> service.</p>
            <p className="text-sm text-gray-500 mt-2">Installation is not applicable.</p>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">What do you need?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => updateFormData('serviceType', 'repair')} className={`p-6 rounded-xl border-2 transition-all text-center ${formData.serviceType === 'repair' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}>
            <FaWrench className="text-3xl mx-auto mb-3 text-blue-600" />
            <h3 className="font-bold text-lg">Repair and Service</h3>
            <p className="text-sm text-gray-500 mt-1">Fix or service your appliance</p>
          </button>
          <button onClick={() => updateFormData('serviceType', 'installation')} className={`p-6 rounded-xl border-2 transition-all text-center ${formData.serviceType === 'installation' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}>
            <FaTools className="text-3xl mx-auto mb-3 text-green-600" />
            <h3 className="font-bold text-lg">Installation</h3>
            <p className="text-sm text-gray-500 mt-1">Set up a new appliance</p>
          </button>
        </div>
      </motion.div>
    )
  }

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Select Brand</h2>
      {loading ? (
        <div className="text-center py-8"><FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" /><p className="text-gray-500">Loading brands...</p></div>
      ) : brands.length === 0 ? (
        <div className="text-center py-8"><p className="text-gray-500">No brands available.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {brands.map((brand) => {
            const brandName = typeof brand === 'string' ? brand : brand.name
            const isSelected = formData.brandName === brandName
            return (
              <button key={brandName} onClick={() => updateFormData('brandName', brandName)} className={`p-2 md:p-3 rounded-lg border-2 transition-all text-sm ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}>
                {brandName}
              </button>
            )
          })}
        </div>
      )}
    </motion.div>
  )

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Describe the Issue</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {commonIssues.map((issue) => (
          <button key={issue} onClick={() => updateFormData('issueDescription', issue)} className={`p-2 md:p-3 rounded-lg border-2 text-left text-sm transition-all ${formData.issueDescription === issue ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'}`}>
            {issue}
          </button>
        ))}
      </div>
      <textarea rows="3" placeholder="Or describe your issue in detail..." value={formData.issueDescription} onChange={(e) => updateFormData('issueDescription', e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm" />
    </motion.div>
  )

  const renderStep5 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Customer Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative"><FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Full Name" value={formData.customerName} onChange={(e) => updateFormData('customerName', e.target.value)} className="w-full pl-10 pr-3 py-2 md:py-3 border rounded-lg focus:border-blue-500 outline-none text-sm" required /></div>
        <div className="relative"><FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" placeholder="Phone Number" maxLength={10} value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, '').slice(0,10))} className="w-full pl-10 pr-3 py-2 md:py-3 border rounded-lg focus:border-blue-500 outline-none text-sm" required /></div>
        <div className="relative md:col-span-2"><FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} className="w-full pl-10 pr-3 py-2 md:py-3 border rounded-lg focus:border-blue-500 outline-none text-sm" required /></div>
        <div className="relative md:col-span-2"><FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" /><textarea rows="2" placeholder="Complete Address with Landmark" value={formData.address} onChange={(e) => updateFormData('address', e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:border-blue-500 outline-none text-sm" required /></div>
        <div className="relative"><input type="text" placeholder="Pincode" maxLength="6" value={formData.pincode} onChange={(e) => updateFormData('pincode', e.target.value.replace(/\D/g, '').slice(0,6))} className="w-full px-3 py-2 md:py-3 border rounded-lg focus:border-blue-500 outline-none text-sm" required /></div>
      </div>
    </motion.div>
  )

  const renderStep6 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Preferred Date & Time</h2>
      <div>
        <label className="block text-sm font-semibold mb-2">Select Date</label>
        <div className="relative">
          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
          <input
            type="date"
            value={formData.preferredDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => updateFormData('preferredDate', e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-lg font-medium cursor-pointer"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => updateFormData('preferredDate', new Date().toISOString().split('T')[0])} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100">Today</button>
          <button onClick={() => updateFormData('preferredDate', '')} className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100">Clear</button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Select Time Slot</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <button key={slot.id} onClick={() => updateFormData('timeSlot', slot.id)} className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${formData.timeSlot === slot.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'}`}>
              <div className="font-medium">{slot.name}</div>
              <div className="text-xs text-gray-500">{slot.period}</div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderStep7 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Review Booking</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 text-sm">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-gray-700">Product</span>
          <span className="text-right text-gray-800">
            {isOtherCategory ? customCategory || 'Other Electronics' : formData.productCategory || 'Not selected'}
            {formData.brandName ? <span className="block text-xs text-gray-500">({formData.brandName})</span> : ''}
          </span>
        </div>
        {selectedProductSupportsInstallation() && (
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Service Type</span>
            <span className="capitalize text-gray-800">{formData.serviceType}</span>
          </div>
        )}
        {needsIssueDescription() && (
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Issue</span>
            <span className="text-right text-gray-800">{formData.issueDescription || 'Not specified'}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Service Date</span>
          <span className="text-right text-gray-800">
            {formData.preferredDate ? `${new Date(formData.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Not selected'}
            {formData.timeSlot ? ` (${formData.timeSlot})` : ''}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Customer</span>
          <span className="text-right text-gray-800">{formData.customerName || 'Not provided'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Contact</span>
          <span className="text-right text-gray-800">
            {formData.phone || 'Not provided'}
            {formData.email ? <span className="block text-xs text-gray-500">{formData.email}</span> : ''}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Address</span>
          <span className="text-right text-gray-800">
            {formData.address || 'Not provided'}
            {formData.pincode ? `, ${formData.pincode}` : ''}
          </span>
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
        <span className="font-semibold">📌 Note:</span> Service charges will be calculated after on-site inspection. Price may vary based on issue and parts required.
      </div>
    </motion.div>
  )

  const getStepComponent = (step) => {
    let s = 1
    if (step === s++) return renderStep1()
    if (selectedProductSupportsInstallation() && step === s++) return renderStep2()
    if (step === s++) return renderStep3()
    if (needsIssueDescription() && step === s++) return renderStep4()
    if (step === s++) return renderStep5()
    if (step === s++) return renderStep6()
    if (step === s++) return renderStep7()
    return null
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="container-custom max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1">
              Book a <span className="text-blue-600">Repair Service</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">Professional help is just a few clicks away</p>
          </div>

          {renderStepIndicator()}

          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 min-h-[450px]">
            <AnimatePresence mode="wait">
              {getStepComponent(currentStep)}
            </AnimatePresence>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              <button onClick={prevStep} className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${currentStep === 1 ? 'invisible' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <FaArrowLeft className="text-xs" /> Back
              </button>
              {currentStep < getTotalSteps() ? (
                <button onClick={nextStep} disabled={!isStepValid(currentStep)} className={`flex items-center gap-1 px-5 py-2 rounded-lg font-semibold transition-all text-sm ${isStepValid(currentStep) ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                  Next <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-1 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md text-sm">
                  {submitting ? 'Processing...' : 'Confirm Booking'} <FaCheckCircle className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookNowPage