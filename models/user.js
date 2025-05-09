const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
googleId: String,
namaDepan: String,
namaBelakang: String,
fotoBase64: String,
nomorHP: String,
noKK: String,
beratBadan: Number,
tinggiBadan: Number,
usiaHamil: Number,
status: {
type: String,
enum: ['aktif', 'nonaktif', 'menunggu-verifikasi'],
default: 'menunggu-verifikasi'
},
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);