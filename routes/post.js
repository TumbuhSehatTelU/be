const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const Komentar=require('../models/komentar')
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
// Mengambil semua post
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'namaDepan namaBelakang');  // Pastikan 'user' didefinisikan dengan benar di schema Post

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
// Menambahkan like pada post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Cari post berdasarkan ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }

    // Periksa apakah user sudah memberi like pada post ini
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ message: 'Anda sudah memberi like pada post ini' });
    }

    // Tambahkan like ke post
    const newLike = new Like({
      user: userId,
      post: postId,
    });

    await newLike.save();
    res.json({ message: 'Like berhasil ditambahkan', like: newLike });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan like' });
  }
});

// Menghapus like dari post
router.delete('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Cari like berdasarkan user dan post
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (!existingLike) {
      return res.status(404).json({ message: 'Like tidak ditemukan' });
    }

    // Hapus like
    await Like.findByIdAndDelete(existingLike._id);
    res.json({ message: 'Like berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus like' });
  }
});
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;  // Mendapatkan ID user dari sesi
    const { postId } = req.params;  // Mendapatkan ID post dari parameter URL

    // Cari post berdasarkan ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }

    // Periksa apakah user sudah memberi like pada post ini
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ message: 'Anda sudah memberi like pada post ini' });
    }

    // Tambahkan like ke post
    const newLike = new Like({
      user: userId,
      post: postId,
    });

    await newLike.save();
    res.json({ message: 'Like berhasil ditambahkan', like: newLike });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan like' });
  }
});
router.delete('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;  // Mendapatkan ID user dari sesi
    const { postId } = req.params;  // Mendapatkan ID post dari parameter URL

    // Cari like berdasarkan user dan post
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (!existingLike) {
      return res.status(404).json({ message: 'Like tidak ditemukan' });
    }

    // Hapus like
    await Like.findByIdAndDelete(existingLike._id);
    res.json({ message: 'Like berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus like' });
  }
});


router.post('/:postId/komentar', async (req, res) => {
  try {
    const { komentar, parent } = req.body;  // Destructuring komentar dan parent dari body
    const { postId } = req.params;  // Mendapatkan postId dari params URL

    // Validasi apakah komentar ada
    if (!komentar) {
      return res.status(400).json({ message: 'Komentar tidak boleh kosong' });
    }

    // Cari post berdasarkan postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }

    // Membuat komentar baru
    const newKomentar = new Komentar({
      komentar,
      parent: parent || null,  // Jika parent null, maka komentar ini bukan balasan
      post: postId,
    });

    await newKomentar.save();
    res.json({ message: 'Komentar berhasil ditambahkan', komentar: newKomentar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan komentar' });
  }
});
router.get('/:postId/komentar', async (req, res) => {
  try {
    const { postId } = req.params;  // Mendapatkan postId dari params URL

    // Cari post berdasarkan postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }

    // Ambil semua komentar untuk post ini, termasuk komentar yang dibalas
    const komentarList = await Komentar.find({ post: postId })
      .populate('user', 'namaDepan namaBelakang')  // Isi data user yang mengomentari
      .populate('parent');  // Isi data parent komentar jika ada

    if (komentarList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada komentar pada post ini' });
    }

    res.json({ komentarList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
});


module.exports = router;
