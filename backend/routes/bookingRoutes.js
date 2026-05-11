const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  cancelBooking,
  addBookingReview,
  getBookingsByDateRange
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const { 
  createBookingValidation, 
  updateBookingStatusValidation, 
  idValidation,
  paginationValidation 
} = require('../middleware/validation');

// Public routes
router.post('/', createBookingValidation, createBooking);

// Protected user routes
router.get('/mybookings', protect, getMyBookings);
router.get('/:id', protect, idValidation, getBookingById);
router.post('/:id/cancel', protect, idValidation, cancelBooking);
router.post('/:id/review', protect, idValidation, addBookingReview);

// Admin only routes
router.get('/', protect, admin, paginationValidation, getAllBookings);
router.get('/stats/overview', protect, admin, getBookingStats);
router.get('/stats/by-date', protect, admin, getBookingsByDateRange);
router.put('/:id/status', protect, admin, updateBookingStatusValidation, updateBookingStatus);
router.delete('/:id', protect, admin, idValidation, deleteBooking);

module.exports = router;