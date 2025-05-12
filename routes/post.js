const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');
const Post = require('../models/post');
const upload = require('../middleware/upload'); // pakai middleware upload

// POST /post - Buat post forum baru dengan upload foto
router.post('/post', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Jika ada file foto, konversi ke base64
    let fotoBase64 = '';
    if (req.file) {
      fotoBase64 = req.file.buffer.toString('base64');
    }

    const newPost = new Post({
      user: user._id,
      foto: fotoBase64,
      judul: req.body.judul,
      isiPost: req.body.isiPost,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post berhasil dibuat', post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat post' });
  }
});

// GET /post - Ambil semua post forum
router.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'namaDepan namaBelakang fotoBase64')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil post' });
  }
});

module.exports = router;
