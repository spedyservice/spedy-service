const dns = require('dns');

// Force IPv4 DNS globally — fixes Render ENETUNREACH on Gmail SMTP
dns.setDefaultResultOrder('ipv4first');

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

// Load environment variables
dotenv.config();

// ================= IMPORT ROUTES =================
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

// ================= IMPORT DATABASE =================
const connectDB = require('./config/db');

// ================= GOOGLE AUTH =================
const { initGoogleStrategy } = require('./services/googleAuthService');

// ================= CREATE APP =================
const app = express();

// ================= TRUST PROXY =================
app.set('trust proxy', 1);

// ================= DATABASE CONNECTION =================
connectDB();

// ================= SECURITY =================
app.use(compression());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// ================= CORS =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://spedy-service.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',    // ✅ added for local frontend (Vite runs on 5000)
  'http://127.0.0.1:5000',    // ✅ optional for safety
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests without origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error('Not allowed by CORS')
        );
      }
    },

    credentials: true,
  })
);

// ================= BODY PARSER =================
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ================= LOGGING =================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ================= RATE LIMIT =================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === 'production'
      ? 1000
      : 10000,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many requests. Please try again later.',
  },
});

app.use('/api', apiLimiter);

// ================= SESSION =================
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      process.env.JWT_SECRET ||
      'spedy_secret',

    resave: false,
    saveUninitialized: false,

    cookie: {
      secure:
        process.env.NODE_ENV === 'production',

      httpOnly: true,

      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',

      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

initGoogleStrategy();

// ================= UPLOADS =================
const uploadsDir = path.join(
  __dirname,
  'uploads'
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}

app.use(
  '/uploads',
  express.static(uploadsDir)
);

// ================= API ROUTES =================
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

// ================= HEALTH ROUTE =================
app.get('/health', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: 'OK',

      uptime: process.uptime(),

      mongodb:
        mongoose.connection.readyState === 1
          ? 'connected'
          : 'disconnected',

      environment:
        process.env.NODE_ENV || 'development',

      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= ROOT ROUTE =================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Spedy Service API Running 🚀',
    environment:
      process.env.NODE_ENV || 'development',
  });
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ================= GLOBAL ERROR =================
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,

    message:
      process.env.NODE_ENV === 'production'
        ? err.message || 'Internal Server Error'
        : err.stack,
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      `📍 Environment: ${
        process.env.NODE_ENV || 'development'
      }`
    );
  }
);

// ================= MONGOOSE EVENTS =================
mongoose.connection.on(
  'connected',
  () => {
    console.log('✅ MongoDB Connected');
  }
);

mongoose.connection.on(
  'disconnected',
  () => {
    console.log('⚠️ MongoDB Disconnected');
  }
);

mongoose.connection.on(
  'error',
  (err) => {
    console.error(
      '❌ MongoDB Error:',
      err.message
    );
  }
);

// ================= SHUTDOWN =================
const gracefulShutdown = async (
  signal
) => {

  console.log(
    `\n⚠️ ${signal} received. Starting graceful shutdown...`
  );

  try {

    server.close(async () => {

      console.log('🛑 HTTP server closed');

      await mongoose.connection.close();

      console.log(
        '✅ MongoDB connection closed'
      );

      process.exit(0);
    });

  } catch (error) {

    console.error(
      '❌ Shutdown Error:',
      error
    );

    process.exit(1);
  }
};

process.on(
  'SIGTERM',
  () => gracefulShutdown('SIGTERM')
);

process.on(
  'SIGINT',
  () => gracefulShutdown('SIGINT')
);

// ================= UNHANDLED ERRORS =================
process.on(
  'unhandledRejection',
  (reason) => {
    console.error(
      '❌ Unhandled Rejection:',
      reason
    );
  }
);

process.on(
  'uncaughtException',
  (error) => {
    console.error(
      '❌ Uncaught Exception:',
      error
    );
  }
);

module.exports = app;