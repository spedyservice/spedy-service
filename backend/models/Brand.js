const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['AC', 'Refrigerator', 'Washing Machine', 'TV', 'Microwave', 'All Appliances', 'All Electronics'],
    default: 'All Electronics'
  },
  description: {
    type: String,
    default: '',
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  serviceCenters: {
    type: Number,
    default: 0
  },
  warrantyOnService: {
    type: Number,
    default: 30,
    min: [0, 'Warranty days cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// FIX: Use async without next — compatible with Mongoose 7+
brandSchema.pre('save', async function () {
  if (this.name && this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  }
});

brandSchema.statics.getActiveBrands = function () {
  return this.find({ isActive: true }).sort('name');
};

brandSchema.statics.getByCategory = function (category) {
  return this.find({ isActive: true, category }).sort('name');
};

brandSchema.index({ isActive: 1 });
brandSchema.index({ category: 1 });
brandSchema.index({ displayOrder: 1 });
brandSchema.index({ name: 1 });
brandSchema.index({ slug: 1 });

module.exports = mongoose.model('Brand', brandSchema);