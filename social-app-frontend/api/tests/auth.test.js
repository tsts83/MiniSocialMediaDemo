const request = require('supertest');
const app = require('../index');  // Import the Express app from server.js
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
    beforeAll(async () => {
        // No need to start the server, supertest works with app directly.
    });

    afterAll(async () => {
        await User.deleteMany();  // Cleanup test users
        await mongoose.connection.close();
    });

    test('✅ Should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token'); // Expect token in response
    });

    test('✅ Should login a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('❌ Should fail login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});
