const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');

// Load env vars
dotenv.config();

// Import routes
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

// Import DB connection
const connectDB = require('./config/db');

// Import Google OAuth strategy
const { initGoogleStrategy } = require('./services/googleAuthService');

const app = express();

// ================= TRUST PROXY =================
app.set('trust proxy', 1);

// ========== SECURITY & MIDDLEWARE ==========

// Compression for faster responses
app.use(compression());

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    xFrameOptions: false,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite:
        process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
initGoogleStrategy();

// ================= CORS =================
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,
        'https://spedy-service.vercel.app',
      ].filter(Boolean)
    : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 1000 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

app.use('/api', limiter);

// ================= BODY PARSER =================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================= LOGGING =================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ================= UPLOADS =================
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
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

// ================= HEALTH CHECK =================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    uptime: process.uptime(),
    mongodb:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ================= ROOT =================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Spedy Service API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ================= GLOBAL ERROR =================
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📍 Environment: ${
      process.env.NODE_ENV || 'development'
    }`
  );
});

// ================= SHUTDOWN =================
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);

  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Shutdown error:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;