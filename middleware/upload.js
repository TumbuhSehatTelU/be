const multer = require("multer");

const storage = multer.memoryStorage(); 
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 } // Batas maksimum 2MB
});

module.exports = upload;