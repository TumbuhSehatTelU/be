const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  roomChatId: {
    type: String,
    default: null, // opsional, jika nanti ingin pakai multi-session
  }
}, { timestamps: true });

module.exports = mongoose.model('chat', chatSchema);
