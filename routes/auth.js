// routes/auth.js
const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const { isProfileComplete } = require('../utils/profileCheck');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

// 1. Redirect to Google login
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// 2. Google callback

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failed' }),
  async (req, res) => {
    const user = req.user;

    const token = generateToken(user);
    const complete = isProfileComplete(user);

    res.json({
      token,
      user,
      complete,
      message: complete ? 'Login success' : 'Lengkapi data diri',
    });
  }
);

// 3. Protected route (example)
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});
router.get('/google/dev', (req, res) => {
  const devKey = req.query.key;

  if (!devKey || devKey !== process.env.DEV_BYPASS_KEY) {
    return res.status(401).json({ message: 'Unauthorized dev key' });
  }

  // Dummy user for development
  const dummyUser = {
      googleId: 1,
  namaDepan: '',
  namaBelakang: '',
  status: 'menunggu-verifikasi',
   
  };

  const token = generateToken(dummyUser);

  res.json({
    message: 'DEV login success,ini cek github action deploy',
    user: dummyUser,
    token,
  });


});



module.exports = router;