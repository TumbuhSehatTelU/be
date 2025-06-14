const mongoose = require('mongoose');

const komentarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },  // User yang mengomentari
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },  // Post yang dikomentari
  komentar: String,  // Isi komentar
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'komentar', default: null },  // Komentar yang dibalas, null jika bukan balasan
}, { timestamps: true });
//a
module.exports = mongoose.model('komentar', komentarSchema);
