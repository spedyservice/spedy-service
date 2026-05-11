const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getPopularServices,
  toggleServiceStatus
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');
const { serviceValidation, idValidation } = require('../middleware/validation');
const { uploadSingleMemory } = require('../middleware/upload');   // ← memory upload

// Public routes
router.get('/', getServices);
router.get('/popular', getPopularServices);
router.get('/slug/:slug', getServiceBySlug);
router.get('/:id', idValidation, getServiceById);

// Admin only routes – now uses memory upload (no disk)
router.post('/', protect, admin, uploadSingleMemory('image'), serviceValidation, createService);
router.put('/:id', protect, admin, idValidation, uploadSingleMemory('image'), serviceValidation, updateService);
router.patch('/:id/toggle-status', protect, admin, idValidation, toggleServiceStatus);
router.delete('/:id', protect, admin, idValidation, deleteService);

module.exports = router;