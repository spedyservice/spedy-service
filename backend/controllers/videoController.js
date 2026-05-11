const Video = require('../models/Video');
const cloudinaryService = require('../config/cloudinary');

// GET /api/videos – public (only active, sorted)
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true }).sort('displayOrder');
    res.json({ success: true, data: videos });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

// GET /api/videos/admin – all videos (for admin)
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort('displayOrder');
    res.json({ success: true, data: videos });
  } catch (error) {
    console.error('Get all videos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

// POST /api/videos – admin create
const createVideo = async (req, res) => {
  try {
    const videoData = { ...req.body };

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Video file is required' });
    }

    const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
      folder: 'mondal-electronics/videos',
    });

    videoData.url = result.url;

    const video = await Video.create(videoData);
    res.status(201).json({ success: true, message: 'Video created', data: video });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create video' });
  }
};

// PUT /api/videos/:id – admin update
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old video from Cloudinary
      if (video.url) {
        const publicId = video.url.split('/').pop().split('.')[0];
        await cloudinaryService.deleteImage(`mondal-electronics/videos/${publicId}`);
      }

      const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
        folder: 'mondal-electronics/videos',
      });
      updateData.url = result.url;
    }

    const updated = await Video.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Video updated', data: updated });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update video' });
  }
};

// DELETE /api/videos/:id – admin delete
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (video.url) {
      const publicId = video.url.split('/').pop().split('.')[0];
      await cloudinaryService.deleteImage(`mondal-electronics/videos/${publicId}`);
    }

    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};

module.exports = { getVideos, getAllVideos, createVideo, updateVideo, deleteVideo };