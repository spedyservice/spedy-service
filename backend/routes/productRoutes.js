const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { idValidation } = require('../middleware/validation');
const { uploadArrayMemory } = require('../middleware/upload');   // ← memory upload

// Public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', idValidation, getProductById);

// Admin only – memory‑based upload
router.post('/', protect, admin, uploadArrayMemory('images', 5), createProduct);
router.put('/:id', protect, admin, idValidation, uploadArrayMemory('images', 5), updateProduct);
router.delete('/:id', protect, admin, idValidation, deleteProduct);

module.exports = router;