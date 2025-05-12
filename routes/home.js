const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkComplete = require('../middleware/profileComplete');

router.get('/', auth, checkComplete, (req, res) => {
  res.json({ message: 'Selamat datang di halaman Home!', user: req.user });
});

module.exports = router;
//s