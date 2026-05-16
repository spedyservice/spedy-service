const mongoose = require('mongoose');

/**
 * Booking Schema - Manages service booking requests
 */
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: false, // ✅ email is now optional
    lowercase: true,
    trim: true,
    // Validate only if email is provided
    validate: {
      validator: function(v) {
        if (!v) return true; // empty string or null is allowed
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please add a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number'],
    default: ''
  },
  productCategory: {
    type: String,
    required: [true, 'Please select product category']
  },
  brandName: {
    type: String,
    required: [true, 'Please select brand'],
    trim: true
  },
  modelNumber: {
    type: String,
    default: '',
    trim: true
  },
  issueDescription: {
    type: String,
    required: [true, 'Please describe the issue'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  issueType: {
    type: String,
    enum: [
      'Not Working',
      'Overheating',
      'Strange Noise',
      'Leakage',
      'Not Cooling/Heating',
      'Display Issue',
      'Power Issue',
      'Other'
    ],
    default: 'Other'
  },
  preferredDate: {
    type: Date,
    required: [true, 'Please select preferred date'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Preferred date cannot be in the past'
    }
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select time slot'],
    enum: [
      '9:00 AM - 11:00 AM',
      '11:00 AM - 1:00 PM',
      '1:00 PM - 3:00 PM',
      '3:00 PM - 5:00 PM',
      '5:00 PM - 7:00 PM'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add address'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  landmark: {
    type: String,
    default: '',
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Please add pincode'],
    match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
      message: 'Invalid status value'
    },
    default: 'pending'
  },
  estimatedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Estimated amount cannot be negative']
  },
  finalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Final amount cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'online'],
    default: 'cash'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  technicianNotes: {
    type: String,
    default: '',
    maxlength: [500, 'Technician notes cannot exceed 500 characters']
  },
  adminNotes: {
    type: String,
    default: '',
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  customerNotes: {
    type: String,
    default: '',
    maxlength: [500, 'Customer notes cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    default: '',
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
  },
  cancelledAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  confirmedAt: { type: Date, default: null },
  images: [{
    url: String,
    publicId: String,
    uploadedAt: Date
  }],
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, maxlength: [500, 'Review cannot exceed 500 characters'], default: '' },
  reviewedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============ PRE-SAVE MIDDLEWARE (Mongoose 7+ compatible - no next) ==========

// Generate unique booking ID before saving
bookingSchema.pre('save', async function() {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const count = await mongoose.model('Booking').countDocuments();
    const sequence = (count + 1).toString().padStart(5, '0');
    this.bookingId = `MOND${year}${month}${day}${sequence}`;
  }
});

// Update timestamps and status timestamps
bookingSchema.pre('save', function() {
  this.updatedAt = Date.now();
  if (this.isModified('status')) {
    if (this.status === 'confirmed' && !this.confirmedAt) this.confirmedAt = Date.now();
    if (this.status === 'completed' && !this.completedAt) this.completedAt = Date.now();
    if (this.status === 'cancelled' && !this.cancelledAt) this.cancelledAt = Date.now();
  }
});

// Calculate total amount before save
bookingSchema.pre('save', function() {
  if (this.finalAmount > 0) {
    this.paidAmount = Math.min(this.paidAmount, this.finalAmount);
    if (this.paidAmount >= this.finalAmount) {
      this.paymentStatus = 'paid';
    } else if (this.paidAmount > 0) {
      this.paymentStatus = 'partial';
    } else {
      this.paymentStatus = 'pending';
    }
  }
});

// ============ INSTANCE METHODS ============

bookingSchema.methods.isCancellable = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

bookingSchema.methods.cancel = async function(reason) {
  if (!this.isCancellable()) throw new Error('Booking cannot be cancelled at this stage');
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = Date.now();
  await this.save();
  return this;
};

bookingSchema.methods.complete = async function(finalAmount, notes) {
  if (this.status !== 'in_progress') throw new Error('Booking must be in progress to complete');
  this.status = 'completed';
  this.finalAmount = finalAmount || this.finalAmount;
  this.completedAt = Date.now();
  if (notes) this.technicianNotes = notes;
  await this.save();
  return this;
};

bookingSchema.methods.addReview = async function(rating, review) {
  if (this.status !== 'completed') throw new Error('Can only review completed bookings');
  if (this.rating) throw new Error('Review already submitted');
  this.rating = rating;
  this.review = review;
  this.reviewedAt = Date.now();
  await this.save();
  return this;
};

bookingSchema.methods.getTotalPayable = function() {
  const subtotal = this.finalAmount || this.estimatedAmount;
  const total = subtotal - (this.discountAmount || 0) + (this.taxAmount || 0);
  return {
    subtotal,
    discount: this.discountAmount || 0,
    tax: this.taxAmount || 0,
    total: Math.max(0, total),
    paid: this.paidAmount || 0,
    due: Math.max(0, total - (this.paidAmount || 0))
  };
};

// ============ STATIC METHODS ============

bookingSchema.statics.getStats = async function(startDate, endDate) {
  const matchQuery = {};
  if (startDate && endDate) {
    matchQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  const stats = await this.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$finalAmount' }, avgAmount: { $avg: '$finalAmount' } } }
  ]);
  const totalBookings = await this.countDocuments(matchQuery);
  const totalRevenue = await this.aggregate([
    { $match: { ...matchQuery, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$finalAmount' } } }
  ]);
  return { byStatus: stats, totalBookings, totalRevenue: totalRevenue[0]?.total || 0 };
};

bookingSchema.statics.getDailyBookings = async function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);
  return await this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
    { $sort: { _id: 1 } }
  ]);
};

// ============ VIRTUAL PROPERTIES ============

bookingSchema.virtual('ageInDays').get(function() {
  if (!this.createdAt) return null;
  return Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

bookingSchema.virtual('formattedDate').get(function() {
  if (!this.createdAt) return 'N/A';
  return this.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

// ============ INDEXES ============
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);