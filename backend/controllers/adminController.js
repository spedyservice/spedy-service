const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Brand = require('../models/Brand');
// NEW e‑commerce models
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Order = require('../models/Order');
// Cloudinary for image upload
const cloudinaryService = require('../config/cloudinary');
// Popup banner model
const PopupBanner = require('../models/PopupBanner');

/**
 * @desc    Get admin dashboard overview
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboardOverview = async (req, res) => {
  try {
    // --- Existing service/booking stats ---
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBrands = await Brand.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const inProgressBookings = await Booking.countDocuments({ status: 'in_progress' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    const currentYear = new Date().getFullYear();
    const monthlyStats = [];
    for (let i = 0; i < 12; i++) {
      const startDate = new Date(currentYear, i, 1);
      const endDate = new Date(currentYear, i + 1, 0);
      const count = await Booking.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });
      monthlyStats.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    // --- NEW sales stats ---
    const totalProducts = await Product.countDocuments();
    const totalCategories = await ProductCategory.countDocuments();
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly sales stats (optional, for chart)
    const monthlySalesStats = [];
    for (let i = 0; i < 12; i++) {
      const startDate = new Date(currentYear, i, 1);
      const endDate = new Date(currentYear, i + 1, 0);
      const count = await Order.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });
      monthlySalesStats.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCustomers,
          totalAdmins,
          totalTechnicians,
          totalBookings,
          totalServices,
          totalBrands,
          todayBookings,
          // Sales
          totalProducts,
          totalCategories,
          totalOrders,
          totalRevenue
        },
        bookingStatus: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          inProgress: inProgressBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        orderStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        recentBookings,
        recentUsers,
        recentOrders,
        monthlyStats,
        monthlySalesStats
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};

/**
 * @desc    Get all users with pagination and filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;
    let query = {};

    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users'
    });
  }
};

/**
 * @desc    Get single user by ID with their bookings
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's booking history
    const bookings = await Booking.find({ email: user.email })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        bookings,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user'
    });
  }
};

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, email, phone, role, isActive, address } = req.body;
    
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
};

/**
 * @desc    Create new admin user (Super Admin only)
 * @route   POST /api/admin/create-admin
 * @access  Private/SuperAdmin
 */
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'admin',
      emailVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create admin'
    });
  }
};

/**
 * @desc    Get system statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getSystemStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Period stats
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });
    
    const weekBookings = await Booking.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    const monthBookings = await Booking.countDocuments({
      createdAt: { $gte: monthAgo }
    });

    // New users by period
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthAgo }
    });

    // Top service categories
    const topCategories = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$productCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        bookings: {
          today: todayBookings,
          thisWeek: weekBookings,
          thisMonth: monthBookings
        },
        newUsers: {
          today: newUsersToday,
          thisWeek: newUsersThisWeek,
          thisMonth: newUsersThisMonth
        },
        topCategories,
        totalUsers: await User.countDocuments(),
        totalBookings: await Booking.countDocuments(),
        activeServices: await Service.countDocuments({ isActive: true }),
        activeBrands: await Brand.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch system statistics'
    });
  }
};

/**
 * @desc    Get booking analytics
 * @route   GET /api/admin/analytics/bookings
 * @access  Private/Admin
 */
const getBookingAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const dailyData = {};
    bookings.forEach(booking => {
      const date = booking.createdAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { total: 0, completed: 0, cancelled: 0 };
      }
      dailyData[date].total++;
      if (booking.status === 'completed') dailyData[date].completed++;
      if (booking.status === 'cancelled') dailyData[date].cancelled++;
    });

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate,
        totalBookings: bookings.length,
        dailyData
      }
    });
  } catch (error) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch booking analytics'
    });
  }
};

/**
 * @desc    Get revenue report
 * @route   GET /api/admin/reports/revenue
 * @access  Private/Admin
 */
const getRevenueReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyRevenue = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const completedBookings = await Booking.find({
        status: 'completed',
        completedAt: { $gte: startDate, $lte: endDate }
      });

      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.finalAmount || 0), 0);
      const totalBookings = completedBookings.length;

      monthlyRevenue.push({
        month: startDate.toLocaleString('default', { month: 'long' }),
        revenue: totalRevenue,
        bookings: totalBookings,
        averageOrderValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
      });
    }

    const totalYearlyRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const totalYearlyBookings = monthlyRevenue.reduce((sum, m) => sum + m.bookings, 0);

    res.json({
      success: true,
      data: {
        year,
        monthlyRevenue,
        summary: {
          totalRevenue: totalYearlyRevenue,
          totalBookings: totalYearlyBookings,
          averageMonthlyRevenue: totalYearlyRevenue / 12,
          averageOrderValue: totalYearlyBookings > 0 ? totalYearlyRevenue / totalYearlyBookings : 0
        }
      }
    });
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch revenue report'
    });
  }
};

// ================= POPUP BANNER MANAGEMENT WITH IMAGE UPLOAD =================

/**
 * @desc    Get active popup banner (public)
 * @route   GET /api/popup-banner
 * @access  Public
 */
const getActivePopupBanner = async (req, res) => {
  try {
    const banner = await PopupBanner.findOne({ isActive: true }).sort({ displayOrder: 1 });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'No active popup banner found' });
    }
    res.json({ success: true, data: banner });
  } catch (error) {
    console.error('Get active popup banner error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all popup banners (admin)
 * @route   GET /api/admin/popup-banners
 * @access  Private/Admin
 */
const getAllPopupBanners = async (req, res) => {
  try {
    const banners = await PopupBanner.find().sort({ displayOrder: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Get all popup banners error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new popup banner (admin) with image upload
 * @route   POST /api/admin/popup-banners
 * @access  Private/Admin
 */
const createPopupBanner = async (req, res) => {
  try {
    const bannerData = { ...req.body };
    
    // Upload image from memory buffer if file provided
    if (req.file) {
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'spedy-popup-banners',
      });
      bannerData.imageUrl = result.url;
    } else {
      // No image file, require imageUrl (fallback)
      if (!bannerData.imageUrl) {
        return res.status(400).json({ success: false, message: 'Image is required' });
      }
    }
    
    const banner = await PopupBanner.create(bannerData);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    console.error('Create popup banner error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a popup banner (admin) with optional image upload
 * @route   PUT /api/admin/popup-banners/:id
 * @access  Private/Admin
 */
const updatePopupBanner = async (req, res) => {
  try {
    const banner = await PopupBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    const updateData = { ...req.body };
    
    // If new image uploaded, delete old one from Cloudinary and upload new
    if (req.file) {
      // Delete old image if exists
      if (banner.imageUrl) {
        const publicId = banner.imageUrl.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`spedy-popup-banners/${publicId}`);
      }
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'spedy-popup-banners',
      });
      updateData.imageUrl = result.url;
    }
    
    const updatedBanner = await PopupBanner.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: updatedBanner });
  } catch (error) {
    console.error('Update popup banner error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a popup banner (admin) and remove image from Cloudinary
 * @route   DELETE /api/admin/popup-banners/:id
 * @access  Private/Admin
 */
const deletePopupBanner = async (req, res) => {
  try {
    const banner = await PopupBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    
    // Delete image from Cloudinary if exists
    if (banner.imageUrl) {
      const publicId = banner.imageUrl.split('/').pop().split('.')[0];
      await cloudinaryService.deleteImage(`spedy-popup-banners/${publicId}`);
    }
    
    await banner.deleteOne();
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete popup banner error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardOverview,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  getSystemStats,
  getBookingAnalytics,
  getRevenueReport,
  getActivePopupBanner,
  getAllPopupBanners,
  createPopupBanner,
  updatePopupBanner,
  deletePopupBanner
};