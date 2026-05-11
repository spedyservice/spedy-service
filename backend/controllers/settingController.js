const Setting = require('../models/Setting');

/**
 * @desc    Get all settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }
    
    // Remove sensitive or unnecessary data for public view
    const publicSettings = {
      siteName: settings.siteName,
      siteLogo: settings.siteLogo,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroImage: settings.heroImage,
      contactInfo: {
        email: settings.contactInfo?.email || settings.siteEmail,
        phone: settings.contactInfo?.phone || settings.sitePhone,
        address: settings.contactInfo?.address || settings.siteAddress
      },
      socialLinks: settings.socialLinks,
      businessHours: settings.businessHours,
      footerText: settings.footerText,
      aboutContent: {
        title: settings.aboutContent?.title,
        description: settings.aboutContent?.description,
        yearsOfExperience: settings.aboutContent?.yearsOfExperience,
        techniciansCount: settings.aboutContent?.techniciansCount,
        customersServed: settings.aboutContent?.customersServed
      },
      homepageContent: settings.homepageContent,
      warrantySettings: {
        defaultWarrantyDays: settings.warrantySettings?.defaultWarrantyDays,
        warrantyTerms: settings.warrantySettings?.warrantyTerms
      }
    };
    
    res.json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch settings'
    });
  }
};

/**
 * @desc    Update all settings (Admin only)
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    // Update each section
    const updatableFields = [
      'siteName', 'siteLogo', 'siteFavicon', 'siteEmail', 'sitePhone', 'siteAddress',
      'heroTitle', 'heroSubtitle', 'heroImage', 'heroButtonText',
      'businessHours', 'footerText', 'testimonialsEnabled'
    ];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    
    // Update nested objects
    if (req.body.contactInfo) {
      settings.contactInfo = { ...settings.contactInfo, ...req.body.contactInfo };
    }
    
    if (req.body.socialLinks) {
      settings.socialLinks = { ...settings.socialLinks, ...req.body.socialLinks };
    }
    
    if (req.body.seo) {
      settings.seo = { ...settings.seo, ...req.body.seo };
    }
    
    if (req.body.bookingSettings) {
      settings.bookingSettings = { ...settings.bookingSettings, ...req.body.bookingSettings };
    }
    
    if (req.body.warrantySettings) {
      settings.warrantySettings = { ...settings.warrantySettings, ...req.body.warrantySettings };
    }
    
    if (req.body.homepageContent) {
      settings.homepageContent = { ...settings.homepageContent, ...req.body.homepageContent };
    }
    
    if (req.body.aboutContent) {
      settings.aboutContent = { ...settings.aboutContent, ...req.body.aboutContent };
    }
    
    if (req.body.notificationSettings) {
      settings.notificationSettings = { ...settings.notificationSettings, ...req.body.notificationSettings };
    }
    
    if (req.body.serviceAreas) {
      settings.serviceAreas = req.body.serviceAreas;
    }
    
    if (req.body.footerLinks) {
      settings.footerLinks = req.body.footerLinks;
    }
    
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update settings'
    });
  }
};

/**
 * @desc    Update contact information only
 * @route   PUT /api/settings/contact
 * @access  Private/Admin
 */
const updateContactInfo = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    settings.contactInfo = { ...settings.contactInfo, ...req.body };
    if (req.body.phone) settings.sitePhone = req.body.phone;
    if (req.body.email) settings.siteEmail = req.body.email;
    if (req.body.address) settings.siteAddress = req.body.address;
    
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Contact information updated successfully',
      data: settings.contactInfo
    });
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update contact information'
    });
  }
};

/**
 * @desc    Update social links only
 * @route   PUT /api/settings/social
 * @access  Private/Admin
 */
const updateSocialLinks = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    settings.socialLinks = { ...settings.socialLinks, ...req.body };
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Social links updated successfully',
      data: settings.socialLinks
    });
  } catch (error) {
    console.error('Update social links error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update social links'
    });
  }
};

/**
 * @desc    Update SEO settings only
 * @route   PUT /api/settings/seo
 * @access  Private/Admin
 */
const updateSeoSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    settings.seo = { ...settings.seo, ...req.body };
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({
      success: true,
      message: 'SEO settings updated successfully',
      data: settings.seo
    });
  } catch (error) {
    console.error('Update SEO settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update SEO settings'
    });
  }
};

/**
 * @desc    Update homepage content only
 * @route   PUT /api/settings/homepage
 * @access  Private/Admin
 */
const updateHomepageContent = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting();
    }
    
    settings.homepageContent = { ...settings.homepageContent, ...req.body };
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Homepage content updated successfully',
      data: settings.homepageContent
    });
  } catch (error) {
    console.error('Update homepage content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update homepage content'
    });
  }
};

/**
 * @desc    Reset settings to default
 * @route   POST /api/settings/reset
 * @access  Private/Admin
 */
const resetSettings = async (req, res) => {
  try {
    await Setting.deleteMany();
    
    const defaultSettings = await Setting.create({});
    
    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      data: defaultSettings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset settings'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updateContactInfo,
  updateSocialLinks,
  updateSeoSettings,
  updateHomepageContent,
  resetSettings
};