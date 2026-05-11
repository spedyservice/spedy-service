const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist (still needed if any legacy code uses disk)
const uploadDir = 'uploads';
const imagesDir = path.join(uploadDir, 'images');
const documentsDir = path.join(uploadDir, 'documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

/**
 * Disk storage configuration
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = imagesDir;

    if (file.mimetype === 'application/pdf') {
      dest = documentsDir;
    } else if (file.fieldname === 'document') {
      dest = documentsDir;
    }

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter for images – accepts ALL image/* MIME types
 */
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed'));
};

/**
 * File filter for documents
 */
const documentFilter = (req, file, cb) => {
  const allowedDocTypes = /pdf|doc|docx|txt/;
  const extname = allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedDocTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (pdf, doc, docx, txt)'));
  }
};

// ── Disk‑based uploaders (still available if needed) ──
const imageUpload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });
const documentUpload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: documentFilter });
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });

const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fields) => upload.fields(fields);
const uploadArray = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// ── MEMORY STORAGE for direct Cloudinary upload (no local files) ──
const memoryStorage = multer.memoryStorage();

const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadSingleMemory = (fieldName) => uploadMemory.single(fieldName);
const uploadArrayMemory = (fieldName, maxCount = 5) => uploadMemory.array(fieldName, maxCount);

/**
 * Error handling wrapper for multer
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB for images and 10MB for documents.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum allowed is 5 files.',
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

/**
 * Delete uploaded file
 */
const deleteUploadedFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file URL
 */
const getFileUrl = (req, filename) => {
  if (!filename) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${filename}`;
};

module.exports = {
  // Disk‑based (legacy)
  upload,
  imageUpload,
  documentUpload,
  uploadSingle,
  uploadMultiple,
  uploadArray,

  // Memory‑based (for direct Cloudinary upload)
  uploadMemory,
  uploadSingleMemory,
  uploadArrayMemory,

  // Utilities
  handleUploadError,
  deleteUploadedFile,
  getFileUrl,
};