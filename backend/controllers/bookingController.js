const Booking = require('../models/Booking');
const emailService = require('../utils/sendEmail');

/**
 * @desc    Create a new booking (OPTIMIZED: emails sent asynchronously)
 * @route   POST /api/bookings
 * @access  Public
 */
const createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      status: 'pending'
    };

    const booking = await Booking.create(bookingData);

    emailService.sendBookingConfirmation(booking, booking.email)
      .catch(err => console.error('Background email error (booking confirmation):', err));

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! Our team will contact you shortly.',
      data: {
        bookingId: booking.bookingId,
        status: booking.status,
        preferredDate: booking.preferredDate,
        timeSlot: booking.timeSlot
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

/**
 * @desc    Get all bookings with filters (Admin only)
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
const getAllBookings = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit,
      startDate,
      endDate,
      productCategory,
      pincode
    } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (productCategory) query.productCategory = productCategory;
    if (pincode) query.pincode = pincode;

    let queryBuilder = Booking.find(query).sort({ createdAt: -1 }).populate('assignedTechnician', 'name phone');

    let total = await Booking.countDocuments(query);
    if (limit && parseInt(limit) > 0) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      queryBuilder = queryBuilder.skip(skip).limit(parseInt(limit));
    }

    const bookings = await queryBuilder;

    res.json({
      success: true,
      data: bookings,
      pagination: limit ? {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      } : null
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      email: req.user.email
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

/**
 * @desc    Get single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('assignedTechnician', 'name phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (req.user.role !== 'admin' && booking.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch booking'
    });
  }
};

/**
 * @desc    Update booking status (Admin only) – FIXED with robust error handling
 * @route   PUT /api/bookings/:id/status
 * @access  Private/Admin
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes, finalAmount, assignedTechnician } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;

    // Update fields
    booking.status = status || booking.status;
    booking.adminNotes = adminNotes || booking.adminNotes;
    booking.finalAmount = finalAmount || booking.finalAmount;
    if (assignedTechnician) {
      // Validate ObjectId before assigning
      const isValid = mongoose.Types.ObjectId.isValid(assignedTechnician);
      if (isValid) {
        booking.assignedTechnician = assignedTechnician;
      } else {
        console.warn(`Invalid technician ID provided: ${assignedTechnician}`);
      }
    }

    await booking.save();

    // Send email only if status changed and email exists
    if (oldStatus !== status && booking.email && booking.email.trim().length > 0) {
      // Fire and forget – don't await to avoid blocking response
      emailService.sendBookingStatusUpdate(booking, booking.email, oldStatus, status)
        .catch(err => console.error('Background email error (status update):', err));
    } else if (oldStatus !== status) {
      console.log(`⚠️ No email provided for booking ${booking.bookingId}, skipping email notification.`);
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update booking status'
    });
  }
};

/**
 * @desc    Cancel booking (User or Admin) – FIXED with email check
 * @route   POST /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (req.user.role !== 'admin' && booking.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (!booking.isCancellable()) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled at ${booking.status} status`
      });
    }

    await booking.cancel(cancellationReason || 'Cancelled by customer');

    // Send cancellation email only if email exists
    if (booking.email && booking.email.trim().length > 0) {
      emailService.sendBookingStatusUpdate(booking, booking.email, booking.status, 'cancelled')
        .catch(err => console.error('Background email error (cancellation):', err));
    } else {
      console.log(`⚠️ No email provided for booking ${booking.bookingId}, skipping cancellation email.`);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};

/**
 * @desc    Add review to completed booking
 * @route   POST /api/bookings/:id/review
 * @access  Private
 */
const addBookingReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const isAuthorized =
      booking.email === req.user.email ||
      (booking.phone && booking.phone === req.user.phone);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    if (booking.rating) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this booking'
      });
    }

    await booking.addReview(rating, review);

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      data: {
        rating: booking.rating,
        review: booking.review
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review'
    });
  }
};

/**
 * @desc    Delete booking (Admin only)
 * @route   DELETE /api/bookings/:id
 * @access  Private/Admin
 */
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    await booking.deleteOne();
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete booking'
    });
  }
};

/**
 * @desc    Get booking statistics (Admin only)
 * @route   GET /api/bookings/stats/overview
 * @access  Private/Admin
 */
const getBookingStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'pending' });
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const inProgress = await Booking.countDocuments({ status: 'in_progress' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      const count = await Booking.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      last7Days.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        count
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        inProgress,
        completed,
        cancelled,
        todayBookings,
        last7Days
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics'
    });
  }
};

/**
 * @desc    Get bookings by date range (Admin only)
 * @route   GET /api/bookings/stats/by-date
 * @access  Private/Admin
 */
const getBookingsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const bookings = await Booking.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ createdAt: 1 });

    const dailyStats = {};
    bookings.forEach(booking => {
      const date = booking.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { count: 0, revenue: 0 };
      }
      dailyStats[date].count++;
      dailyStats[date].revenue += booking.finalAmount || 0;
    });

    res.json({
      success: true,
      data: {
        total: bookings.length,
        dailyStats,
        bookings
      }
    });
  } catch (error) {
    console.error('Get bookings by date error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

/**
 * @desc    Get public reviews from completed bookings (for testimonials)
 * @route   GET /api/bookings/reviews/public
 * @access  Public
 */
const getPublicReviews = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: 'completed',
      rating: { $exists: true, $ne: null, $gte: 1 }
    })
      .select('customerName rating review reviewedAt updatedAt createdAt')
      .sort({ reviewedAt: -1, updatedAt: -1, createdAt: -1 })
      .limit(20);

    const reviews = bookings.map(b => ({
      _id: b._id,
      customerName: b.customerName || 'Customer',
      rating: b.rating,
      review: b.review || '',
      updatedAt: b.reviewedAt || b.updatedAt || b.createdAt
    }));

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get public reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews'
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  cancelBooking,
  addBookingReview,
  getBookingStats,
  getBookingsByDateRange,
  getPublicReviews
};