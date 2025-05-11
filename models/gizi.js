const mongoose = require('mongoose');

const giziSchema = new mongoose.Schema({
  anak: { type: mongoose.Schema.Types.ObjectId, ref: 'anak' },
  tanggal: Date,
  karbohidrat: Number,
  protein: Number,
  lemak: Number,
  serat: Number,
  vitamin: [{
    tipe: String,
    satuan: String,
    total: Number
  }],
  mineral: [{
    tipe: String,
    satuan: String,
    total: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('gizi', giziSchema);
