const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: { type: String, default: 'FaWrench' },
  imageUrl: { type: String, default: '' },
  commonIssues: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  popular: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// Async pre-save hook - NO next parameter (Mongoose 7+ compatible)
serviceSchema.pre('save', async function() {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  }
});

serviceSchema.statics.getActiveServices = function() {
  return this.find({ isActive: true }).sort('displayOrder');
};

serviceSchema.statics.getPopularServices = function(limit = 6) {
  return this.find({ isActive: true, popular: true }).sort('displayOrder').limit(limit);
};

serviceSchema.index({ isActive: 1 });
serviceSchema.index({ popular: 1 });
serviceSchema.index({ displayOrder: 1 });
serviceSchema.index({ name: 1 });
serviceSchema.index({ slug: 1 });

module.exports = mongoose.model('Service', serviceSchema);