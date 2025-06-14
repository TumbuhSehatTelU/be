const express = require('express');
const request = require('supertest');
const upload = require('../middleware/upload'); // menyesuaikan path
const path = require('path');
const fs = require('fs');

describe('Upload Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        app.post('/upload', upload.single('file'), (req, res) => {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            res.status(200).json({ message: 'Upload successful', size: req.file.size });
        });

        // ✅ Tambahkan error handler untuk menangkap error multer
        app.use((err, req, res, next) => {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'File terlalu besar' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        });
    });

    it('should upload a valid file successfully', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('file', Buffer.from('Test file content'), 'testfile.txt');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Upload successful');
        expect(res.body.size).toBeGreaterThan(0);
    });

    it('should fail when file size exceeds limit', async () => {
        const largeBuffer = Buffer.alloc(21 * 1024 * 1024); // 21MB
        const res = await request(app)
            .post('/upload')
            .attach('file', largeBuffer, 'largefile.txt');

        expect(res.status).toBe(413); // Multer default: 413 Payload Too Large
    });

    it('should return error when no file is uploaded', async () => {
        const res = await request(app)
            .post('/upload');

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('No file uploaded');
    });
});
