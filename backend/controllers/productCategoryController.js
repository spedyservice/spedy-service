const ProductCategory = require('../models/ProductCategory');
const cloudinaryService = require('../config/cloudinary');

const getCategories = async (req, res) => {
  try {
    const { isActive } = req.query;
    let query = {};
    if (isActive === 'true') query.isActive = true;

    const categories = await ProductCategory.find(query).sort('displayOrder');
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch categories' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch category' });
  }
};

const createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };

    // Upload from memory buffer (no disk)
    if (req.file) {
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/categories',
      });
      categoryData.image = result.url;
    }

    const category = await ProductCategory.create(categoryData);

    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    res.status(400).json({ success: false, message: error.message || 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    let imageUrl = category.image; // keep existing

    if (req.file) {
      // Delete old Cloudinary image
      if (category.image) {
        const publicId = category.image.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`mondal-electronics/categories/${publicId}`);
      }

      // Upload new image from buffer
      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/categories',
      });
      imageUrl = result.url;
    }

    const updatedData = { ...req.body, image: imageUrl, updatedAt: Date.now() };
    const updatedCategory = await ProductCategory.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    res.json({ success: true, message: 'Category updated successfully', data: updatedCategory });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    res.status(400).json({ success: false, message: error.message || 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    // Delete image from Cloudinary
    if (category.image) {
      const publicId = category.image.split('/').pop().split('.')[0];
      await cloudinaryService.deleteImage(`mondal-electronics/categories/${publicId}`);
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete category' });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };