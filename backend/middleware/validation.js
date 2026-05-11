const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware - checks for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * User registration validation rules
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('en-IN').withMessage('Please provide a valid 10-digit Indian phone number'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
  
  validate
];

/**
 * User login validation rules
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

/**
 * Booking creation validation rules
 */
const createBookingValidation = [
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('en-IN').withMessage('Please provide a valid 10-digit phone number'),
  
  body('productCategory')
    .notEmpty().withMessage('Product category is required'),
  
  body('brandName')
    .trim()
    .notEmpty().withMessage('Brand name is required'),
  
  body('issueDescription')
    .trim()
    .notEmpty().withMessage('Issue description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('preferredDate')
    .notEmpty().withMessage('Preferred date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom(value => {
      if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Preferred date cannot be in the past');
      }
      return true;
    }),
  
  body('timeSlot')
    .notEmpty().withMessage('Time slot is required'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
  
  body('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .isPostalCode('IN').withMessage('Please provide a valid 6-digit pincode'),
  
  validate
];

/**
 * Booking status update validation
 */
const updateBookingStatusValidation = [
  param('id')
    .isMongoId().withMessage('Invalid booking ID'),
  
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'])
    .withMessage('Invalid status value'),
  
  body('adminNotes')
    .optional()
    .isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters'),
  
  body('finalAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Final amount must be a positive number'),
  
  validate
];

/**
 * Service validation rules - UPDATED (removed price fields, description optional)
 */
const serviceValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Service name is required'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  // Removed priceRangeMin and priceRangeMax validations
  
  validate
];

/**
 * Brand validation rules
 */
const brandValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Brand name is required'),
  
  validate
];

/**
 * Pagination validation
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  validate
];

/**
 * ID param validation
 */
const idValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createBookingValidation,
  updateBookingStatusValidation,
  serviceValidation,
  brandValidation,
  paginationValidation,
  idValidation
};