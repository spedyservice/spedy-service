const mongoose = require('mongoose');

/**
 * Setting Schema - Manages website configuration and content
 */
const settingSchema = new mongoose.Schema({
  // Site Information
  siteName: {
    type: String,
    default: 'Mondal Refrigeration & Electronics',
    required: true
  },
  siteLogo: { type: String, default: '' },
  siteFavicon: { type: String, default: '' },
  siteEmail: { type: String, default: 'mondalrefrigeration@example.com' },
  sitePhone: [{ type: String, trim: true }],
  siteAddress: { type: String, default: '' },
  
  // Hero Section
  heroTitle: {
    type: String,
    default: 'Expert Home Repair Services for All Electronics Brands'
  },
  heroSubtitle: {
    type: String,
    default: 'Professional repair services for TV, Fridge, AC, Washing Machine, and all home electronics. Fast, reliable, and affordable.'
  },
  heroImage: { type: String, default: '' },
  heroButtonText: { type: String, default: 'Book a Service' },
  
  // Business Hours
  businessHours: {
    weekdays: { type: String, default: '9:00 AM - 8:00 PM' },
    saturday: { type: String, default: '9:00 AM - 6:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },
  
  // Service Areas
  serviceAreas: [{
    city: String,
    pincodes: [String],
    isActive: { type: Boolean, default: true }
  }],
  
  // Contact Information
  contactInfo: {
    email: { type: String, default: '' },
    phone: [{ type: String }],
    alternatePhone: [{ type: String }],
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    googleMapLink: { type: String, default: '' }
  },
  
  // Social Media Links
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  
  // SEO Settings
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' }
  },
  
  // Booking Settings
  bookingSettings: {
    advanceNoticeHours: { type: Number, default: 24 },
    maxBookingsPerDay: { type: Number, default: 50 },
    allowWeekendBooking: { type: Boolean, default: true },
    cancellationWindowHours: { type: Number, default: 2 }
  },
  
  // Warranty Settings
  warrantySettings: {
    defaultWarrantyDays: { type: Number, default: 30 },
    warrantyTerms: { type: String, default: '' }
  },
  
  // Homepage Content
  homepageContent: {
    whyChooseUs: {
      title: { type: String, default: 'Why Choose Us' },
      features: [{
        title: String,
        description: String,
        icon: String
      }]
    },
    howItWorks: {
      title: { type: String, default: 'How It Works' },
      steps: [{
        stepNumber: Number,
        title: String,
        description: String
      }]
    }
  },
  
  // About Page
  aboutContent: {
    title: { type: String, default: 'About Us' },
    description: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    teamImage: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 10 },
    techniciansCount: { type: Number, default: 25 },
    customersServed: { type: Number, default: 5000 }
  },
  
  // Testimonials
  testimonialsEnabled: { type: Boolean, default: true },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    adminEmailOnBooking: { type: Boolean, default: true },
    customerEmailOnStatusChange: { type: Boolean, default: true }
  },
  
  // Footer Settings
  footerText: {
    type: String,
    default: '© 2026 Mondal Refrigeration & Electronics. All rights reserved.'
  },
  footerLinks: [{
    title: String,
    url: String,
    openInNewTab: { type: Boolean, default: false }
  }]
}, {
  timestamps: true  // This automatically handles createdAt and updatedAt
});

// REMOVED the duplicate pre('save') middleware - timestamps already handles updatedAt

// Get contact phone as string
settingSchema.methods.getContactPhone = function() {
  if (this.contactInfo.phone && this.contactInfo.phone.length > 0) {
    return this.contactInfo.phone[0];
  }
  return this.sitePhone[0] || '';
};

// Get full address
settingSchema.methods.getFullAddress = function() {
  return this.siteAddress || this.contactInfo.address || '';
};

// Static method to get settings singleton
settingSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Setting', settingSchema);