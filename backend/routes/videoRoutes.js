const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { protect, admin } = require('../middleware/auth');
const {
  getVideos,
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');

// Public route
router.get('/', getVideos);

// Admin routes
router.get('/admin', protect, admin, getAllVideos);
router.post('/', protect, admin, upload.single('video'), createVideo);
router.put('/:id', protect, admin, upload.single('video'), updateVideo);
router.delete('/:id', protect, admin, deleteVideo);

module.exports = router;