const User = require('../models/User');

/**
 * Admin Authorization Middleware with enhanced checks
 */
const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This area is restricted to administrators only.'
      });
    }

    // Verify admin still exists in database and is active
    const adminUser = await User.findById(req.user._id);
    
    if (!adminUser) {
      return res.status(403).json({
        success: false,
        message: 'Admin account not found.'
      });
    }

    if (!adminUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated. Please contact support.'
      });
    }

    // Add admin specific info to request
    req.isSuperAdmin = adminUser.email === process.env.ADMIN_EMAIL;
    req.adminUser = adminUser;

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying admin privileges'
    });
  }
};

/**
 * Super Admin check - only the main admin account
 */
const isSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'Super admin privileges required for this action.'
      });
    }

    next();
  } catch (error) {
    console.error('Super admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying super admin privileges'
    });
  }
};

/**
 * Log admin actions middleware
 */
const logAdminAction = async (req, res, next) => {
  const startTime = Date.now();
  
  // Store original send function
  const originalSend = res.json;
  
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    // Log admin action (in production, save to database)
    console.log(`[ADMIN ACTION] ${req.user?.email} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);
    
    // You can save to a separate AdminLog collection here
    // await AdminLog.create({ adminId: req.user._id, action: req.originalUrl, method: req.method, timestamp: new Date() });
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = { 
  isAdmin, 
  isSuperAdmin,
  logAdminAction 
};