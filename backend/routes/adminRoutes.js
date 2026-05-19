const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  getSystemStats,
  getBookingAnalytics,
  getRevenueReport,
  getAllPopupBanners,
  createPopupBanner,
  updatePopupBanner,
  deletePopupBanner,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin, isSuperAdmin } = require('../middleware/admin');
const { idValidation, paginationValidation } = require('../middleware/validation');
const { uploadSingleMemory } = require('../middleware/upload');

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(isAdmin);

// Dashboard and stats
router.get('/dashboard', getDashboardOverview);
router.get('/stats', getSystemStats);
router.get('/analytics/bookings', getBookingAnalytics);
router.get('/reports/revenue', getRevenueReport);

// User management
router.get('/users', paginationValidation, getAllUsers);
router.get('/users/:id', idValidation, getUserById);
router.put('/users/:id', idValidation, updateUser);
router.delete('/users/:id', idValidation, deleteUser);

// Admin creation (super admin only)
router.post('/create-admin', isSuperAdmin, createAdmin);

// Popup banner management with image upload
router.get('/popup-banners', getAllPopupBanners);
router.post('/popup-banners', uploadSingleMemory('image'), createPopupBanner);
router.put('/popup-banners/:id', idValidation, uploadSingleMemory('image'), updatePopupBanner);
router.delete('/popup-banners/:id', idValidation, deletePopupBanner);

module.exports = router;