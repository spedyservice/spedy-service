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
  getBookingsByDateRange,
  getPublicReviews
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const {
  createBookingValidation,
  updateBookingStatusValidation,
  idValidation,
  paginationValidation
} = require('../middleware/validation');

// ─── Public routes ───────────────────────────────────────────────
router.post('/', createBookingValidation, createBooking);

// ✅ All static/named routes MUST come before /:id
router.get('/reviews/public', getPublicReviews);
router.get('/mybookings', protect, getMyBookings);

// ✅ Admin stat routes also before /:id so Express doesn't swallow them
router.get('/stats/overview', protect, admin, getBookingStats);
router.get('/stats/by-date', protect, admin, getBookingsByDateRange);

// ─── Admin list route ─────────────────────────────────────────────
router.get('/', protect, admin, paginationValidation, getAllBookings);

// ─── Param routes (/:id) — always last ───────────────────────────
router.get('/:id', protect, idValidation, getBookingById);
router.post('/:id/cancel', protect, idValidation, cancelBooking);
router.post('/:id/review', protect, idValidation, addBookingReview);
router.put('/:id/status', protect, admin, updateBookingStatusValidation, updateBookingStatus);
router.delete('/:id', protect, admin, idValidation, deleteBooking);

module.exports = router;