const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateContactInfo,
  updateSocialLinks,
  updateSeoSettings,
  updateHomepageContent,
  resetSettings
} = require('../controllers/settingController');
const { protect, admin } = require('../middleware/auth');

// Public route
router.get('/', getSettings);

// Admin only routes
router.put('/', protect, admin, updateSettings);
router.put('/contact', protect, admin, updateContactInfo);
router.put('/social', protect, admin, updateSocialLinks);
router.put('/seo', protect, admin, updateSeoSettings);
router.put('/homepage', protect, admin, updateHomepageContent);
router.post('/reset', protect, admin, resetSettings);

module.exports = router;