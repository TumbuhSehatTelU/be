const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // 🟢 <--- inilah yang harus ADA
    console.log('✅ User decoded dari token:', req.user);
    next();
  } catch (err) {
    console.error('❌ Gagal verifikasi token:', err.message);
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

