const Banner = require('../models/Banner');
const cloudinaryService = require('../config/cloudinary');

// Public – get active banners sorted by displayOrder
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('displayOrder');
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

// Admin – get all banners (including inactive)
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('displayOrder');
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

// Admin – create a banner (upload images via memory)
const createBanner = async (req, res) => {
  try {
    const bannerData = { ...req.body };

    // Upload desktop image
    if (req.files?.desktopImage) {
      const result = await cloudinaryService.uploadBuffer(
        req.files.desktopImage[0].buffer,
        { folder: 'mondal-electronics/banners' }
      );
      bannerData.desktopImage = result.url;
    }

    // Upload mobile image (optional)
    if (req.files?.mobileImage) {
      const result = await cloudinaryService.uploadBuffer(
        req.files.mobileImage[0].buffer,
        { folder: 'mondal-electronics/banners' }
      );
      bannerData.mobileImage = result.url;
    }

    const banner = await Banner.create(bannerData);
    res.status(201).json({ success: true, message: 'Banner created', data: banner });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create banner' });
  }
};

// Admin – update a banner
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    const updateData = { ...req.body };

    // Replace desktop image if provided
    if (req.files?.desktopImage) {
      // Delete old image from Cloudinary
      if (banner.desktopImage) {
        const publicId = banner.desktopImage.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`mondal-electronics/banners/${publicId}`);
      }
      const result = await cloudinaryService.uploadBuffer(
        req.files.desktopImage[0].buffer,
        { folder: 'mondal-electronics/banners' }
      );
      updateData.desktopImage = result.url;
    }

    // Replace mobile image if provided
    if (req.files?.mobileImage) {
      if (banner.mobileImage) {
        const publicId = banner.mobileImage.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`mondal-electronics/banners/${publicId}`);
      }
      const result = await cloudinaryService.uploadBuffer(
        req.files.mobileImage[0].buffer,
        { folder: 'mondal-electronics/banners' }
      );
      updateData.mobileImage = result.url;
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Banner updated', data: updated });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update banner' });
  }
};

// Admin – delete a banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    // Delete images from Cloudinary
    if (banner.desktopImage) {
      const publicId = banner.desktopImage.split('/').pop().split('.')[0];
      await cloudinaryService.deleteImage(`mondal-electronics/banners/${publicId}`);
    }
    if (banner.mobileImage) {
      const publicId = banner.mobileImage.split('/').pop().split('.')[0];
      await cloudinaryService.deleteImage(`mondal-electronics/banners/${publicId}`);
    }

    await banner.deleteOne();
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };