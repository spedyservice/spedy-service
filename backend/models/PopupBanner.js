const mongoose = require('mongoose');

const popupBannerSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  buttonText: { type: String, default: 'Book Now' },
  buttonLink: { type: String, default: '/book-now' },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null }, // optional expiry
}, { timestamps: true });

module.exports = mongoose.model('PopupBanner', popupBannerSchema);