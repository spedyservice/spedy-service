const express = require('express');
const router = express.Router();
const { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');
const { idValidation } = require('../middleware/validation');
const { uploadMemory } = require('../middleware/upload');

// Public
router.get('/', getBanners);

// Admin
router.get('/admin', protect, admin, getAllBanners);
router.post('/', protect, admin, uploadMemory.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), createBanner);
router.put('/:id', protect, admin, idValidation, uploadMemory.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), updateBanner);
router.delete('/:id', protect, admin, idValidation, deleteBanner);

module.exports = router;