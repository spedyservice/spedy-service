const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token for user authentication
 * @param {string} userId - User's MongoDB ID
 * @param {string} role - User's role (customer/admin/technician)
 * @returns {string} JWT token
 */
const generateToken = (userId, role = 'customer') => {
  return jwt.sign(
    { 
      id: userId,
      role: role,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

/**
 * Generate Refresh Token (optional, for longer sessions)
 * @param {string} userId - User's MongoDB ID
 * @returns {string} Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '90d' }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT Token without verification
 * @param {string} token - JWT token to decode
 * @returns {object} Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { 
  generateToken, 
  generateRefreshToken, 
  verifyToken, 
  decodeToken 
};