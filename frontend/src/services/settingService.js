import api from './api'

const settingService = {
  getSettings: async () => {
    const response = await api.get('/settings')
    return response.data
  },

  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData)
    return response.data
  },

  updateContactInfo: async (contactData) => {
    const response = await api.put('/settings/contact', contactData)
    return response.data
  },

  updateSocialLinks: async (socialData) => {
    const response = await api.put('/settings/social', socialData)
    return response.data
  },

  updateSeoSettings: async (seoData) => {
    const response = await api.put('/settings/seo', seoData)
    return response.data
  },

  updateHomepageContent: async (homepageData) => {
    const response = await api.put('/settings/homepage', homepageData)
    return response.data
  },

  resetSettings: async () => {
    const response = await api.post('/settings/reset')
    return response.data
  },
}

export default settingService
