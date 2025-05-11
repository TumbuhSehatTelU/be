const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');
const upload = require('../middleware/upload');

// Simpan data diri awal
// POST /register
router.post('/profile', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const googleId = req.user.id;

    const update = {
      namaDepan: req.body.namaDepan,
      namaBelakang: req.body.namaBelakang,
      nomorHP: req.body.nomorHP,
      noKK: req.body.noKK,
      beratBadan: req.body.beratBadan,
      tinggiBadan: req.body.tinggiBadan,
      usiaHamil: req.body.usiaHamil || null,
      status: req.body.status || 'menunggu-verifikasi',
    };

    // Jika ada file, konversi ke base64 dan simpan
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      update.fotoBase64 = base64;
    }

    const user = await User.findOneAndUpdate({ googleId }, update, {
      new: true,
      upsert: true,
    });

    res.json({ message: 'Data diri berhasil disimpan', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan data diri' });
  }
});

// Update data diri (PUT)
router.put('/profile', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const googleId = req.user.id;

    const update = {
      namaDepan: req.body.namaDepan,
      namaBelakang: req.body.namaBelakang,
      nomorHP: req.body.nomorHP,
      noKK: req.body.noKK,
      beratBadan: req.body.beratBadan,
      tinggiBadan: req.body.tinggiBadan,
      usiaHamil: req.body.usiaHamil || null,
      status: req.body.status || 'menunggu-verifikasi',
    };

    // Jika ada file foto, convert ke base64 dan tambahkan ke update
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      update.fotoBase64 = base64;
    }

    const updated = await User.findOneAndUpdate({ googleId }, update, {
      new: true,
      upsert: true,
    });

    res.json({ message: 'Data diri berhasil diperbarui', user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui data diri' });
  }
});

// Ambil profil
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil profil user' });
  }
});
router.post('/anak', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

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
    res.status(500).json({ message: 'Gagal menambahkan anak' });
  }
});


module.exports = router;
