const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  roomChatId: String,
  sender: { type: String, enum: ['ibu', 'bapak'] },
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('chat', chatSchema);
