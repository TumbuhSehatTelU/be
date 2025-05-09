const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user'); // pastikan model ada

// Update data diri
router.post('/register', authMiddleware, async (req, res) => {
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
	  };
      
	const updated = await User.findOneAndUpdate({ googleId }, update, { new: true, upsert: true });
      
	  res.json({ message: 'Data diri berhasil disimpan', user: updated });
	} catch (err) {
	  console.error(err); // tambahkan ini untuk debug log
	  res.status(500).json({ message: 'Gagal menyimpan data diri' });
	  console.error(err)
	}
      });
      
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
module.exports = router;
