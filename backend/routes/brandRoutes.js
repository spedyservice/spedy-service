const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus
} = require('../controllers/brandController');
const { protect, admin } = require('../middleware/auth');
const { brandValidation, idValidation } = require('../middleware/validation');
const { uploadSingleMemory } = require('../middleware/upload');   // ← memory upload

// Public routes
router.get('/', getBrands);
router.get('/slug/:slug', getBrandBySlug);
router.get('/:id', idValidation, getBrandById);

// Admin only routes – memory‑based upload
router.post('/', protect, admin, uploadSingleMemory('logo'), brandValidation, createBrand);
router.put('/:id', protect, admin, idValidation, uploadSingleMemory('logo'), brandValidation, updateBrand);
router.patch('/:id/toggle-status', protect, admin, idValidation, toggleBrandStatus);
router.delete('/:id', protect, admin, idValidation, deleteBrand);

module.exports = router;