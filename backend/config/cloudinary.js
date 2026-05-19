const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

class CloudinaryService {
  constructor() {
    this.isConfigured = false;
    this.configure();
  }

  configure() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        timeout: 60000, // ✅ added to prevent timeout on large uploads
      });
      this.isConfigured = true;
      console.log('✅ Cloudinary configured successfully');
    } else {
      console.warn('⚠️ Cloudinary credentials not provided. Image upload disabled.');
      this.isConfigured = false;
    }
  }

  /**
   * 🔥 UPLOAD FROM BUFFER (no local file storage)
   * @param {Buffer} buffer - File buffer from multer memoryStorage
   * @param {Object} options - Cloudinary upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadBuffer(buffer, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    const defaultOptions = {
      folder: 'spedy-popup-banners', // ✅ changed from 'mondal-electronics' to dedicated folder
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      resource_type: 'auto',
      timeout: 60000, // ✅ added to prevent timeout
    };

    const uploadOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error(`Failed to upload image: ${error.message}`));
          }
          resolve({
            success: true,
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            createdAt: result.created_at,
          });
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Upload image from local file path (legacy – kept for reference)
   * @param {string} filePath - Local file path
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadImage(filePath, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    try {
      const defaultOptions = {
        folder: 'mondal-electronics',
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        resource_type: 'auto',
      };

      const uploadOptions = { ...defaultOptions, ...options };
      const result = await cloudinary.uploader.upload(filePath, uploadOptions);

      // Delete local file after upload
      this.deleteLocalFile(filePath);

      return {
        success: true,
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        createdAt: result.created_at,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload multiple images (buffers)
   * @param {Array<{buffer: Buffer, originalname: string}>} files - File objects with buffer
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleBuffers(files, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    const uploadPromises = files.map((file) =>
      file.buffer
        ? this.uploadBuffer(file.buffer, options)
        : this.uploadImage(file.path, options)
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteImage(publicId) {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        publicId,
        result,
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Get image URL with transformations
   * @param {string} publicId - Cloudinary public ID
   * @param {Object} transformations - Transformation options
   * @returns {string} Transformed image URL
   */
  getImageUrl(publicId, transformations = {}) {
    if (!publicId) return null;

    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
    };

    const transforms = { ...defaultTransformations, ...transformations };
    return cloudinary.url(publicId, transforms);
  }

  /**
   * Delete local file after upload
   * @param {string} filePath - Local file path
   */
  deleteLocalFile(filePath) {
    try {
      const fs = require('fs');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting local file:', error);
    }
  }

  /**
   * Check if Cloudinary is configured
   * @returns {boolean}
   */
  isConfiguredService() {
    return this.isConfigured;
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

module.exports = cloudinaryService;