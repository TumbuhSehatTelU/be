// utils/jwt.js
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object
 * @returns {string} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      namaDepan: user.namaDepan,
      namaBelakang: user.namaBelakang,
      email: user.email,
      status: user.status,
      googleId: user.googleId || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};
