const request = require('supertest');
const express = require('express');

// Mock isProfileComplete
jest.mock('../utils/profileCheck', () => ({
    isProfileComplete: jest.fn(),
}));

const { isProfileComplete } = require('../utils/profileCheck');
const profileComplete = require('../middleware/profileComplete');

describe('profileComplete Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        // Dummy route untuk test middleware
        app.get('/secure', (req, res, next) => {
            req.user = { name: 'Test User' }; // Simulasi user login
            next();
        }, profileComplete, (req, res) => {
            res.status(200).json({ message: 'Access granted' });
        });
    });

    it('should block request if profile is incomplete', async () => {
        isProfileComplete.mockReturnValue(false); // Simulasi tidak lengkap

        const res = await request(app).get('/secure');
        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Lengkapi data diri terlebih dahulu');
    });

    it('should allow request if profile is complete', async () => {
        isProfileComplete.mockReturnValue(true); // Simulasi lengkap

        const res = await request(app).get('/secure');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Access granted');
    });
});
