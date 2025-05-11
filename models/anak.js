const mongoose = require('mongoose');

const anakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  namaDepan: String,
  namaBelakang: String,
  bulanLahir: Date,
  tahunLahir: Number,
  beratBadan: Number,
  tinggiBadan: Number,
  foto: String,
}, { timestamps: true });

module.exports = mongoose.model('anak', anakSchema);
