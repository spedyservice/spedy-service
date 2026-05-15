const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,           // kept as fallback (optional)
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// ========== PUBLIC ROUTES ==========

// Email/Password registration and login
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Google OAuth (popup fallback – optional)
router.post('/google', googleAuth);

// Google OAuth redirect (full page redirect flow)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback – returns user with JWT token
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = req.user.token;
    if (!token) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }
    // Redirect to frontend callback page with token
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
  }
);

// Password reset flow
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Email verification
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// ========== PROTECTED ROUTES (require login) ==========
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;