const Brand = require('../models/Brand');
const cloudinaryService = require('../config/cloudinary');

/**
 * @desc    Get all brands
 * @route   GET /api/brands
 * @access  Public
 */
const getBrands = async (req, res) => {
  try {
    const { isActive, category } = req.query;
    let query = {};

    if (isActive === 'true') query.isActive = true;
    if (category) query.category = category;

    const brands = await Brand.find(query).sort('name');

    // Cloudinary URLs are absolute – no need to prepend anything
    res.json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch brands'
    });
  }
};

/**
 * @desc    Get single brand by ID
 * @route   GET /api/brands/:id
 * @access  Public
 */
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    console.error('Get brand by ID error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch brand' });
  }
};

/**
 * @desc    Get brand by slug
 * @route   GET /api/brands/slug/:slug
 * @access  Public
 */
const getBrandBySlug = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    console.error('Get brand by slug error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch brand' });
  }
};

/**
 * @desc    Create new brand (Admin only)
 * @route   POST /api/brands
 * @access  Private/Admin
 */
const createBrand = async (req, res) => {
  try {
    const brandData = { ...req.body };

    // Upload logo from memory buffer (no disk)
    if (req.file) {
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/brands',
      });
      brandData.logo = result.url;
    }

    const brand = await Brand.create(brandData);

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    console.error('Create brand error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Brand with this name already exists' });
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to create brand' });
  }
};

/**
 * @desc    Update brand (Admin only)
 * @route   PUT /api/brands/:id
 * @access  Private/Admin
 */
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    let logoUrl = brand.logo; // keep existing

    if (req.file) {
      // Delete old Cloudinary logo if present
      if (brand.logo) {
        const publicId = brand.logo.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`mondal-electronics/brands/${publicId}`);
      }
      // Upload new logo from buffer
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/brands',
      });
      logoUrl = result.url;
    }

    const updatedData = { ...req.body, logo: logoUrl, updatedAt: Date.now() };
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: updatedBrand
    });
  } catch (error) {
    console.error('Update brand error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Brand with this name already exists' });
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to update brand' });
  }
};

/**
 * @desc    Toggle brand active status (Admin only)
 * @route   PATCH /api/brands/:id/toggle-status
 * @access  Private/Admin
 */
const toggleBrandStatus = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    brand.isActive = !brand.isActive;
    brand.updatedAt = Date.now();
    await brand.save();

    res.json({
      success: true,
      message: `Brand ${brand.isActive ? 'activated' : 'deactivated'} successfully`,
      data: brand
    });
  } catch (error) {
    console.error('Toggle brand status error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to toggle brand status' });
  }
};

/**
 * @desc    Delete brand (Admin only)
 * @route   DELETE /api/brands/:id
 * @access  Private/Admin
 */
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    // Delete logo from Cloudinary
    if (brand.logo) {
      const publicId = brand.logo.split('/').pop().split('.')[0];
      await cloudinaryService.deleteImage(`mondal-electronics/brands/${publicId}`);
    }

    await brand.deleteOne();

    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete brand' });
  }
};

module.exports = {
  getBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus
};