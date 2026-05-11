const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/productCategoryController');
const { protect, admin } = require('../middleware/auth');
const { idValidation } = require('../middleware/validation');
const { uploadSingleMemory } = require('../middleware/upload');   // ← memory upload

// Public
router.get('/', getCategories);
router.get('/:id', idValidation, getCategoryById);

// Admin only – memory‑based upload
router.post('/', protect, admin, uploadSingleMemory('image'), createCategory);
router.put('/:id', protect, admin, idValidation, uploadSingleMemory('image'), updateCategory);
router.delete('/:id', protect, admin, idValidation, deleteCategory);

module.exports = router;