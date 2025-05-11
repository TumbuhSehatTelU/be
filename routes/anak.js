const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');
const Anak = require('../models/anak');

// Menambahkan anak baru untuk user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });
    console.log('User ID dari token:', req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const newAnak = new Anak({
      user: user._id,  // Referensikan ke user
      namaDepan: req.body.namaDepan,
      namaBelakang: req.body.namaBelakang,
      bulanLahir: req.body.bulanLahir,
      tahunLahir: req.body.tahunLahir,
      beratBadan: req.body.beratBadan,
      tinggiBadan: req.body.tinggiBadan,
      foto: req.body.foto,  // Bisa berupa URL atau base64
    });

    await newAnak.save();
    res.json({ message: 'Anak berhasil ditambahkan', anak: newAnak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambaaahkan anak' });
  }
});

// Mengupdate data anak berdasarkan ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const updatedAnak = await Anak.findOneAndUpdate(
      { _id: req.params.id, user: user._id },
      {
        namaDepan: req.body.namaDepan,
        namaBelakang: req.body.namaBelakang,
        bulanLahir: req.body.bulanLahir,
        tahunLahir: req.body.tahunLahir,
        beratBadan: req.body.beratBadan,
        tinggiBadan: req.body.tinggiBadan,
        foto: req.body.foto,  // Bisa berupa URL atau base64
      },
      { new: true }
    );

    if (!updatedAnak) {
      return res.status(404).json({ message: 'Anak tidak ditemukan atau tidak milik user' });
    }

    res.json({ message: 'Data anak berhasil diperbarui', anak: updatedAnak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui data anak' });
  }
});

// Mengambil semua anak milik user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Ambil semua anak yang milik user ini
    const anakList = await Anak.find({ user: user._id });

    if (anakList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada anak untuk user ini' });
    }

    res.json({ anakList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data anak' });
  }
});

// Mengambil data anak tertentu sesuai orang tua
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Cari anak berdasarkan ID dan pastikan anak ini milik user ini
    const anak = await Anak.findOne({ _id: req.params.id, user: user._id });

    if (!anak) {
      return res.status(404).json({ message: 'Anak tidak ditemukan atau tidak milik user' });
    }

    res.json({ anak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data anak' });
  }
});

module.exports = router;
