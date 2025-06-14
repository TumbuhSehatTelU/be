const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/auth');

describe('Auth Middleware', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.get('/protected', authMiddleware, (req, res) => {
            res.status(200).json({ message: 'Access granted', user: req.user });
        });
    });

    test('should return 401 if no token is provided', async () => {
        const res = await request(app).get('/protected');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token');
    });

    test('should return 403 if token is invalid', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Invalid token');
    });

    test('should allow access if token is valid', async () => {
        const payload = { id: 1, name: 'Test User' };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret');

        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Access granted');
        expect(res.body.user).toMatchObject(payload);
    });
});
