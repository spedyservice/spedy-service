const Banner = require('../models/Banner');
const cloudinaryService = require('../config/cloudinary');

// ──────────────────────────────────────────────
// Helper: inject Cloudinary transformations
// ──────────────────────────────────────────────
function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || !url.includes('/upload/')) return url;

  const { width = 'auto', quality = 'auto', format = 'auto', dpr = 'auto' } = options;
  const transformation = `q_${quality},f_${format},w_${width},dpr_${dpr},c_limit`;

  // Insert transformation right after '/upload/'
  return url.replace('/upload/', `/upload/${transformation}/`);
}

// ──────────────────────────────────────────────
// Public – get active banners (optimised URLs)
// ──────────────────────────────────────────────
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('displayOrder');

    // Optimise each banner's image URLs
    const optimisedBanners = banners.map((banner) => {
      const obj = banner.toObject();
      if (obj.desktopImage) {
        obj.desktopImage = optimizeCloudinaryUrl(obj.desktopImage);
      }
      if (obj.mobileImage) {
        obj.mobileImage = optimizeCloudinaryUrl(obj.mobileImage);
      }
      return obj;
    });

    res.json({ success: true, data: optimisedBanners });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

// ──────────────────────────────────────────────
// Admin – get all banners (including inactive) – raw URLs (admin doesn't need optimisation)
// ──────────────────────────────────────────────
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('displayOrder');
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

// ──────────────────────────────────────────────
// Admin – create a banner (upload with transformations)
// ──────────────────────────────────────────────
const createBanner = async (req, res) => {
  try {
    const bannerData = { ...req.body };

    // Upload desktop image with optimisation during upload (optional but recommended)
    if (req.files?.desktopImage) {
      const result = await cloudinaryService.uploadBuffer(
        req.files.desktopImage[0].buffer,
        {
          folder: 'mondal-electronics/banners',
          transformation: [
            { width: 1920, height: 600, crop: 'fill' },
            { quality: 'auto:good', fetch_format: 'auto' }
          ]
        }
      );
      bannerData.desktopImage = result.url;
    }

    // Upload mobile image with optimisation
    if (req.files?.mobileImage) {
      const result = await cloudinaryService.uploadBuffer(
        req.files.mobileImage[0].buffer,
        {
          folder: 'mondal-electronics/banners',
          transformation: [
            { width: 750, height: 400, crop: 'fill' },
            { quality: 'auto:good', fetch_format: 'auto' }
          ]
        }
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

// ──────────────────────────────────────────────
// Admin – update a banner (with optimisation on re‑upload)
// ──────────────────────────────────────────────
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    const updateData = { ...req.body };

    // Replace desktop image if provided
    if (req.files?.desktopImage) {
      // Delete old image
      if (banner.desktopImage) {
        const publicId = banner.desktopImage.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`mondal-electronics/banners/${publicId}`);
      }
      const result = await cloudinaryService.uploadBuffer(
        req.files.desktopImage[0].buffer,
        {
          folder: 'mondal-electronics/banners',
          transformation: [
            { width: 1920, height: 600, crop: 'fill' },
            { quality: 'auto:good', fetch_format: 'auto' }
          ]
        }
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
        {
          folder: 'mondal-electronics/banners',
          transformation: [
            { width: 750, height: 400, crop: 'fill' },
            { quality: 'auto:good', fetch_format: 'auto' }
          ]
        }
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

// ──────────────────────────────────────────────
// Admin – delete a banner
// ──────────────────────────────────────────────
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