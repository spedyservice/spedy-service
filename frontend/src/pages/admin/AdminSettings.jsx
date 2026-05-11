import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSave, FaUndo, FaSpinner, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import toast from 'react-hot-toast'
import settingService from '../../services/settingService'

const AdminSettings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await settingService.getSettings()
      if (response.success) setSettings(response.data)
    } catch (error) { toast.error('Failed to fetch settings') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingService.updateSettings(settings)
      toast.success('Settings saved successfully')
    } catch (error) { toast.error('Failed to save settings') }
    finally { setSaving(false) }
  }

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        const response = await settingService.resetSettings()
        setSettings(response.data)
        toast.success('Settings reset to default')
      } catch (error) { toast.error('Failed to reset settings') }
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social' },
    { id: 'seo', label: 'SEO' },
    { id: 'homepage', label: 'Homepage' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Loading settings...</p>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Site Settings</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Manage your website content and configuration</p>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button onClick={handleReset} className="btn-secondary inline-flex items-center gap-2 text-sm py-2 px-4">
              <FaUndo size={14} />
              <span>Reset</span>
            </button>
            <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4">
              <FaSave size={14} />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-4 md:mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold mb-3">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="input-label">Site Name</label>
                <input type="text" value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Site Logo URL</label>
                <input type="text" value={settings.siteLogo || ''} onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })} className="input-field" placeholder="https://example.com/logo.png" />
              </div>
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold mb-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaPhone className="text-blue-600 text-xs" />
                  <span>Phone Numbers (comma separated)</span>
                </label>
                <input type="text" value={settings.contactInfo?.phone?.join(', ') || ''} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value.split(',').map(p => p.trim()) } })} className="input-field" placeholder="+91 98093 37833, +91 86173 60203" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaEnvelope className="text-blue-600 text-xs" />
                  <span>Email Address</span>
                </label>
                <input type="email" value={settings.contactInfo?.email || ''} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })} className="input-field" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaClock className="text-blue-600 text-xs" />
                  <span>Working Hours</span>
                </label>
                <input type="text" value={settings.businessHours?.weekdays || ''} onChange={(e) => setSettings({ ...settings, businessHours: { ...settings.businessHours, weekdays: e.target.value } })} className="input-field" placeholder="9:00 AM - 8:00 PM" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600 text-xs" />
                  <span>Address</span>
                </label>
                <input type="text" value={settings.contactInfo?.address || ''} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })} className="input-field" />
              </div>
            </div>
          </div>
        )}

        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold mb-3">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaFacebook className="text-blue-600" />
                  <span>Facebook</span>
                </label>
                <input type="url" value={settings.socialLinks?.facebook || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} className="input-field" placeholder="https://facebook.com/yourpage" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaInstagram className="text-pink-600" />
                  <span>Instagram</span>
                </label>
                <input type="url" value={settings.socialLinks?.instagram || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} className="input-field" placeholder="https://instagram.com/yourprofile" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaTwitter className="text-blue-400" />
                  <span>Twitter</span>
                </label>
                <input type="url" value={settings.socialLinks?.twitter || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} className="input-field" placeholder="https://twitter.com/yourhandle" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <FaYoutube className="text-red-600" />
                  <span>YouTube</span>
                </label>
                <input type="url" value={settings.socialLinks?.youtube || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} className="input-field" placeholder="https://youtube.com/yourchannel" />
              </div>
            </div>
          </div>
        )}

        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold mb-3">SEO Settings</h2>
            <div className="space-y-3">
              <div>
                <label className="input-label">Meta Title</label>
                <input type="text" value={settings.seo?.metaTitle || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Meta Description</label>
                <textarea rows="2" value={settings.seo?.metaDescription || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: e.target.value } })} className="input-field" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Google Analytics ID</label>
                  <input type="text" value={settings.seo?.googleAnalyticsId || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, googleAnalyticsId: e.target.value } })} className="input-field" placeholder="UA-XXXXX-Y" />
                </div>
                <div>
                  <label className="input-label">Facebook Pixel ID</label>
                  <input type="text" value={settings.seo?.facebookPixelId || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, facebookPixelId: e.target.value } })} className="input-field" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section Settings */}
        {activeTab === 'homepage' && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="text-base md:text-lg font-bold mb-3">Hero Section</h2>
            <div className="space-y-3">
              <div>
                <label className="input-label">Hero Title</label>
                <input type="text" value={settings.heroTitle || ''} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Hero Subtitle</label>
                <textarea rows="2" value={settings.heroSubtitle || ''} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Hero Image URL</label>
                <input type="text" value={settings.heroImage || ''} onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })} className="input-field" placeholder="https://example.com/hero-image.jpg" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminSettings