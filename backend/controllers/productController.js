const Product = require('../models/Product');
const Category = require('../models/ProductCategory');  // ← added
const cloudinaryService = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const { isActive, category, featured, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    let query = {};

    if (isActive === 'true') query.isActive = true;
    if (featured === 'true') query.featured = true;
    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ── ENHANCED SEARCH: match by product name OR category name ──
    if (search) {
      const nameRegex = { $regex: search, $options: 'i' };
      // Find categories whose name matches the search term
      const matchingCategories = await Category.find({ name: nameRegex }).select('_id');
      const categoryIds = matchingCategories.map(c => c._id);

      // Build OR condition: either product name matches, or product category is one of the matching categories
      const searchConditions = [{ name: nameRegex }];
      if (categoryIds.length > 0) {
        searchConditions.push({ category: { $in: categoryIds } });
      }
      query.$or = searchConditions;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch products' });
  }
};

// ... all other functions (getFeaturedProducts, getProductById, etc.) remain exactly the same ...
// The rest of your file is unchanged, so I'll include them for completeness.

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .populate('category', 'name slug')
      .limit(10)
      .sort('-createdAt');

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch featured products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch product' });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Upload multiple images from memory buffers
    if (req.files && req.files.length > 0) {
      const results = await cloudinaryService.uploadMultipleBuffers(
        req.files.map(file => ({ buffer: file.buffer, originalname: file.originalname })),
        { folder: 'mondal-electronics/products' }
      );
      productData.images = results.map(r => r.url);
    }

    const product = await Product.create(productData);

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Product with this name already exists' });
    res.status(400).json({ success: false, message: error.message || 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // 1. Parse existing images the admin wants to keep (sent as form field)
    let existingImages = req.body.existingImages || [];
    // If it arrives as a single string (possible with formdata), wrap it
    if (typeof existingImages === 'string') {
      existingImages = [existingImages];
    }

    // 2. Build final image array: new uploads first, then kept existing images
    let finalImages = [];
    if (req.files && req.files.length > 0) {
      const results = await cloudinaryService.uploadMultipleBuffers(
        req.files.map(file => ({ buffer: file.buffer, originalname: file.originalname })),
        { folder: 'mondal-electronics/products' }
      );
      finalImages = results.map(r => r.url);
    }
    // Append the URLs the admin kept (they are already in Cloudinary)
    finalImages = finalImages.concat(existingImages);

    // 3. Identify which old images were removed
    const oldImages = product.images || [];
    const imagesToDelete = oldImages.filter(url => !finalImages.includes(url));

    // 4. Delete removed images from Cloudinary
    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(url => {
        const parts = url.split('/');
        const folderAndFile = parts.slice(-2).join('/');
        const publicId = folderAndFile.split('.')[0];
        return cloudinaryService.deleteImage(publicId);
      });
      await Promise.all(deletePromises);
    }

    // 5. Update product record
    const updatedData = {
      ...req.body,
      images: finalImages,
      updatedAt: Date.now()
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({ success: true, message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Product with this name already exists' });
    res.status(400).json({ success: false, message: error.message || 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Delete all associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(url => {
        const parts = url.split('/');
        const folderAndFile = parts.slice(-2).join('/');
        const publicId = folderAndFile.split('.')[0];
        return cloudinaryService.deleteImage(publicId);
      });
      await Promise.all(deletePromises);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};