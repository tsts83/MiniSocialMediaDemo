const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
    afterAll(async () => {
        console.log("🗑️ Cleaning up test database...");
        await User.deleteMany({});
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Optional small delay if your DB needs breathing room
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('✅ Should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: `user_${Date.now()}`,
                email: `user_${Date.now()}@example.com`,
                password: 'password123'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    test('✅ Should login a user', async () => {
        const uniqueEmail = `login_${Date.now()}@example.com`;
        const password = 'password123';

        // Register first
        await request(app).post('/api/auth/register').send({
            username: `loginuser_${Date.now()}`,
            email: uniqueEmail,
            password
        });

        // Then login
        const res = await request(app).post('/api/auth/login').send({
            email: uniqueEmail,
            password
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('❌ Should fail login with incorrect password', async () => {
        const email = `fail_${Date.now()}@example.com`;

        // Register user
        await request(app).post('/api/auth/register').send({
            username: `failuser_${Date.now()}`,
            email,
            password: 'correctpassword'
        });

        // Try logging in with wrong password
        const res = await request(app).post('/api/auth/login').send({
            email,
            password: 'wrongpassword'
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});
