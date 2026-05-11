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
  getRevenueReport
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin, isSuperAdmin } = require('../middleware/admin');
const { idValidation, paginationValidation } = require('../middleware/validation');

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(isAdmin);  // Changed from 'admin' to 'isAdmin'

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

module.exports = router;