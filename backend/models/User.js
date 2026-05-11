const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * User Schema - Manages customers and admin users
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address'
    ]
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'admin', 'technician'],
      message: 'Role must be either customer, admin, or technician'
    },
    default: 'customer'
  },
  profileImage: { type: String, default: null },
  address: {
    street: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    pincode: {
      type: String,
      default: '',
      match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
    },
    country: { type: String, default: 'India' }
  },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============ PRE-SAVE MIDDLEWARE ============

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ============ INSTANCE METHODS ============

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

userSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return verificationToken;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  return resetToken;
};

userSchema.methods.getFullAddress = function () {
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.pincode,
    this.address.country
  ].filter(part => part && part.trim());
  return parts.join(', ');
};

userSchema.methods.updateLastLogin = async function () {
  await this.constructor.updateOne(
    { _id: this._id },
    {
      $set: { lastLogin: Date.now() },
      $inc: { loginCount: 1 }
    }
  );
};

// ============ STATIC METHODS ============

userSchema.statics.findByEmailOrPhone = function (email, phone) {
  return this.findOne({
    $or: [{ email: email.toLowerCase() }, { phone: phone }]
  });
};

userSchema.statics.getStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        inactive: {
          $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        role: '$_id',
        count: 1,
        active: 1,
        inactive: 1,
        _id: 0
      }
    }
  ]);
};

// ============ VIRTUAL PROPERTIES ============

userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: 'email',
  foreignField: 'email',
  justOne: false
});

userSchema.virtual('initials').get(function () {
  if (!this.name) return '';
  return this.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

userSchema.virtual('maskedEmail').get(function () {
  if (!this.email) return '';
  const [username, domain] = this.email.split('@');
  return `${username.slice(0, 3)}***${username.slice(-2)}@${domain}`;
});

userSchema.virtual('maskedPhone').get(function () {
  if (!this.phone) return '';
  return '******' + this.phone.slice(-4);
});

// ============ INDEXES ============
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', userSchema);