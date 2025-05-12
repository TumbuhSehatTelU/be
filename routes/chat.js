const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Chat = require('../models/chat');
const User = require('../models/user');

// POST /chat - kirim chat user/bot
router.post('/', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const newChat = new Chat({
      user: user._id,
      sender: req.body.sender, // 'user' atau 'bot'
      message: req.body.message,
      roomChatId: req.body.roomChatId || null,
    });

    await newChat.save();
    res.status(201).json({ message: 'Pesan berhasil dikirim', chat: newChat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengirim chat' });
  }
});

// GET /chat - ambil semua chat user ini
router.get('/', authMiddleware, async (req, res) => {
  try {
    const googleId = req.user.id;
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const chats = await Chat.find({ user: user._id }).sort({ createdAt: 1 });
    res.json({ chats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil chat' });
  }
});

module.exports = router;

