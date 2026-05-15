const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const brandRoutes = require('./routes/brandRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingRoutes = require('./routes/settingRoutes');
const productRoutes = require('./routes/productRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const videoRoutes = require('./routes/videoRoutes');

const connectDB = require('./config/db');

const app = express();

// ---------- Security & Parsing ----------
// Helmet with all policies disabled that could block Google OAuth
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  xFrameOptions: false,
}));

// 🔥 FORCEFULLY REMOVE ALL BLOCKING HEADERS
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Resource-Policy');
  // Also prevent any future headers from being set by accident
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// CORS – production & development
const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  /^http:\/\/192\.168\.\d+\.\d+:5000$/,
  /^http:\/\/10\.\d+\.\d+\.\d+:5000$/,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(pattern =>
      typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
    )) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5000 : 10000,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

// ──────────────────────────────────────────────
// ✨ Lightweight In-Memory Cache for Public Data
// ──────────────────────────────────────────────
const cacheStore = new Map();

const cache = (ttlSeconds = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl;
    const now = Date.now();
    const cached = cacheStore.get(key);

    if (cached && cached.expiry > now) {
      console.log(`⚡ Cache hit: ${key}`);
      return res.status(200).json(cached.data);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200) {
        cacheStore.set(key, {
          data: body,
          expiry: now + ttlSeconds * 1000
        });
      }
      return originalJson(body);
    };

    next();
  };
};

// Apply cache to public routes
app.use('/api/banners', cache(600));
app.use('/api/categories', cache(300));
app.use('/api/brands', cache(300));
app.use('/api/services', cache(300));
app.use('/api/bookings/reviews/public', cache(120));
app.use('/api/products', cache(120));
app.use('/api/videos', cache(300));

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/videos', videoRoutes);

// ---------- Health Check ----------
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ---------- Root Route ----------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Spedy Service API',
    version: '1.0.0',
    status: 'active',
    environment: process.env.NODE_ENV
  });
});

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'NOT_FOUND'
  });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 CORS allowed origins: ${process.env.FRONTEND_URL || 'localhost'}`);
});

// ---------- Graceful Shutdown (Mongoose 7+) ----------
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(async (err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (dbErr) {
      console.error('Error closing MongoDB connection:', dbErr);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', async (err) => {
  console.error('Unhandled Rejection:', err);
  await gracefulShutdown('unhandledRejection');
});

module.exports = app;