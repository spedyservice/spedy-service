import api from './api'

const settingService = {
  getSettings: async () => {
    return await api.get('/settings')
  },

  updateSettings: async (settingsData) => {
    return await api.put('/settings', settingsData)
  },

  updateContactInfo: async (contactData) => {
    return await api.put('/settings/contact', contactData)
  },

  updateSocialLinks: async (socialData) => {
    return await api.put('/settings/social', socialData)
  },

  updateSeoSettings: async (seoData) => {
    return await api.put('/settings/seo', seoData)
  },

  updateHomepageContent: async (homepageData) => {
    return await api.put('/settings/homepage', homepageData)
  },

  resetSettings: async () => {
    return await api.post('/settings/reset')
  },
}

export default settingService