const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');
const Anak = require('../models/anak');
const Gizi = require('../models/gizi');
const upload = require('../middleware/upload'); // Middleware upload foto

// Menambahkan anak baru untuk user
router.post('/', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Ambil data anak dari form-data
    const newAnak = new Anak({
      user: user._id, // Referensikan ke user
      namaDepan: req.body.namaDepan,
      namaBelakang: req.body.namaBelakang,
      bulanLahir: req.body.bulanLahir,
      tahunLahir: req.body.tahunLahir,
      beratBadan: req.body.beratBadan,
      tinggiBadan: req.body.tinggiBadan,
      foto: req.file ? req.file.buffer.toString('base64') : null, // Jika ada foto, konversi ke base64
    });

    // Simpan data anak
    await newAnak.save();
    res.json({ message: 'Anak berhasil ditambahkan', anak: newAnak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan anak' });
  }
});

// Mengupdate data anak berdasarkan ID
router.put('/:id', authMiddleware, upload.single('foto'), async (req, res) => {

  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Cari anak berdasarkan ID dan pastikan anak ini milik user
    const updatedAnak = await Anak.findOneAndUpdate(
      { _id: req.params.id, user: user._id },
      {
        namaDepan: req.body.namaDepan,
        namaBelakang: req.body.namaBelakang,
        bulanLahir: req.body.bulanLahir,
        tahunLahir: req.body.tahunLahir,
        beratBadan: req.body.beratBadan,
        tinggiBadan: req.body.tinggiBadan,
        foto: req.file ? req.file.buffer.toString('base64') : req.body.foto, // Update foto jika ada
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
router.post('/gizi/:anakId', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const anak = await Anak.findOne({ _id: req.params.anakId, user: user._id });
    if (!anak) return res.status(404).json({ message: 'Anak tidak ditemukan atau tidak milik user' });

    const {
      tanggal,
      karbohidrat,
      protein,
      lemak,
      serat,
      vitamin,
      mineral
    } = req.body;

    const giziBaru = new Gizi({
      anak: anak._id,
      tanggal,
      karbohidrat,
      protein,
      lemak,
      serat,
      vitamin,
      mineral
    });

    await giziBaru.save();
    res.json({ message: 'Data gizi berhasil ditambahkan', gizi: giziBaru });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan data gizi' });
  }
});
router.get('/gizi/:anakId', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const anak = await Anak.findOne({ _id: req.params.anakId, user: user._id });
    if (!anak) return res.status(404).json({ message: 'Anak tidak ditemukan atau tidak milik user' });

    const giziList = await Gizi.find({ anak: anak._id }).sort({ tanggal: -1 });

    res.json({ anak: anak.namaDepan + ' ' + anak.namaBelakang, giziList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data gizi' });
  }
});

module.exports = router;
