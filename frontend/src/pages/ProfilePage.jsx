import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaKey, FaEdit, FaSave, FaTimes, FaCheckCircle,
  FaClipboardList, FaSpinner
} from 'react-icons/fa'

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'

  const setTab = (tab) => {
    setSearchParams(tab === 'profile' ? {} : { tab })
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'address', label: 'Saved Address', icon: FaMapMarkerAlt },
    { id: 'password', label: 'Change Password', icon: FaKey },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your profile, address and security settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* User Card */}
              <div className="p-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <p className="font-bold text-center text-lg">{user?.name}</p>
                <p className="text-blue-200 text-xs text-center mt-1 truncate">{user?.email}</p>
                <div className="mt-2 text-center">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                    {user?.role || 'Customer'}
                  </span>
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mb-1 ${
                        active
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 font-semibold'
                      }`}
                    >
                      <Icon className={`text-sm ${active ? 'text-white' : 'text-blue-600'}`} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <a
                    href="/my-bookings"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200"
                  >
                    <FaClipboardList className="text-sm text-blue-600" />
                    <span>My Bookings</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} />}
            {activeTab === 'address' && <AddressTab user={user} updateProfile={updateProfile} />}
            {activeTab === 'password' && <PasswordTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ PROFILE TAB ============
const ProfileTab = ({ user, updateProfile }) => {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.phone.trim()) return toast.error('Phone is required')
    if (!/^[0-9]{10}$/.test(form.phone)) return toast.error('Enter valid 10-digit phone number')

    setLoading(true)
    try {
      await updateProfile({ name: form.name, phone: form.phone })
      setEditing(false)
    } catch (err) {
      // error toast handled in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
          <p className="text-gray-500 text-sm mt-1">Update your personal details</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-blue-600" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${
                editing
                  ? 'border-blue-400 focus:border-blue-600 focus:outline-none bg-white'
                  : 'border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Email (read only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-blue-600" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                Locked
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-blue-600" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${
                editing
                  ? 'border-blue-400 focus:border-blue-600 focus:outline-none bg-white'
                  : 'border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Role (read only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Type
            </label>
            <input
              type="text"
              value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'}
              disabled
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed text-sm capitalize"
            />
          </div>
        </div>

        {editing && (
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
              }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

// ============ ADDRESS TAB ============
const AddressTab = ({ user, updateProfile }) => {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })

  useEffect(() => {
    if (user?.address) {
      setForm({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        pincode: user.address.pincode || '',
        country: user.address.country || 'India',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode)) {
      return toast.error('Pincode must be 6 digits')
    }
    setLoading(true)
    try {
      await updateProfile({ address: form })
      setEditing(false)
    } catch (err) {
      // error handled in context
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'street', label: 'Street / Area', placeholder: 'e.g. 12 MG Road, Sector 5', colSpan: 'md:col-span-2' },
    { name: 'city', label: 'City', placeholder: 'e.g. Bokaro' },
    { name: 'state', label: 'State', placeholder: 'e.g. Jharkhand' },
    { name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', maxLength: 6 },
    { name: 'country', label: 'Country', placeholder: 'India' },
  ]

  const hasAddress = user?.address?.city || user?.address?.street

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Saved Address</h2>
          <p className="text-gray-500 text-sm mt-1">Your service address for bookings</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <FaEdit />
            <span>{hasAddress ? 'Edit' : 'Add Address'}</span>
          </button>
        )}
      </div>

      {!editing && !hasAddress && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMapMarkerAlt className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-500 font-medium">No address saved yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your address for faster bookings</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Address
          </button>
        </div>
      )}

      {!editing && hasAddress && (
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <FaMapMarkerAlt className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1">Home Address</p>
              <p className="text-gray-600 text-sm">
                {[user.address.street, user.address.city, user.address.state, user.address.pincode, user.address.country]
                  .filter(Boolean).join(', ')}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <FaCheckCircle className="text-green-500 text-xs" />
                <span className="text-xs text-green-600 font-semibold">Verified Address</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div key={field.name} className={field.colSpan || ''}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:outline-none text-sm bg-white"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{loading ? 'Saving...' : 'Save Address'}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ============ PASSWORD TAB ============
const PasswordTab = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.currentPassword) return toast.error('Current password is required')
    if (form.newPassword.length < 6) return toast.error('New password must be at least 6 characters')
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.currentPassword === form.newPassword) return toast.error('New password must be different from current')

    setLoading(true)
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const passwordFields = [
    { name: 'currentPassword', label: 'Current Password', key: 'current' },
    { name: 'newPassword', label: 'New Password', key: 'new' },
    { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
  ]

  const getStrength = (password) => {
    if (!password) return { label: '', color: '', width: '0%' }
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' }
    if (password.length < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Strong', color: 'bg-green-500', width: '100%' }
    return { label: 'Good', color: 'bg-blue-500', width: '75%' }
  }

  const strength = getStrength(form.newPassword)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
        <p className="text-gray-500 text-sm mt-1">Keep your account secure with a strong password</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 max-w-md">
          {passwordFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field.key] ? 'text' : 'password'}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPasswords[field.key] ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Password strength indicator (only for new password) */}
              {field.name === 'newPassword' && form.newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Password strength</span>
                    <span className={`font-semibold ${
                      strength.label === 'Weak' ? 'text-red-500' :
                      strength.label === 'Fair' ? 'text-yellow-600' :
                      strength.label === 'Good' ? 'text-blue-600' : 'text-green-600'
                    }`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-800 mb-2">Password Tips:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Include uppercase letters for stronger security</li>
              <li>• Include numbers and special characters</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 w-full"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaKey />}
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage