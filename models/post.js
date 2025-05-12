const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Gunakan 'User' (huruf kapital) sesuai dengan model User
  foto: String,
  judul: String,
  isiPost: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);  // Gunakan 'Post' (huruf kapital) di sini
