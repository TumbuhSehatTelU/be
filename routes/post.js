const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Post = require('../models/post');
const User = require('../models/user');
const upload = require('../middleware/upload');  // Middleware untuk upload foto

router.post('/', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }


    // Jika foto ada, konversi buffer menjadi base64
    const fotoBase64 = req.file ? req.file.buffer.toString('base64') : req.body.foto;

    const newPost = new Post({
      user: user._id,  // Referensikan ke user
      foto: fotoBase64,  // Menyimpan foto dalam format base64
      judul: req.body.judul,
      isiPost: req.body.isiPost,
    });

    await newPost.save();
    res.json({ message: 'Post berhasil ditambahkan', post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan post' });
  }
});

// Mengambil semua post
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'namaDepan namaBelakang') // Mengambil data user terkait
      .sort({ createdAt: -1 }); // Mengurutkan post berdasarkan waktu pembuatan terbaru

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Tidak ada post yang ditemukan' });
    }

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data post' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'namaDepan namaBelakang'); // Mengambil data user terkait

    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }

    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data post' });
  }
});
module.exports = router;
