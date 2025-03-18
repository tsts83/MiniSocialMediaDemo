const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

describe('Posts API', () => {
    let server;
    let token;
    let userId;

    beforeAll(async () => {

        // Register a test user
        const userRes = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });

        token = userRes.body.token;
        userId = userRes.body.user._id;
    });

    afterAll(async () => {
        await User.deleteMany();
        await Post.deleteMany();
        await mongoose.connection.close();
    });

    test('✅ Should create a post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is a test post' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.text).toBe('This is a test post');
    });

    test('❌ Should not create a post without authentication', async () => {
        const res = await request(app)
            .post('/api/posts')
            .send({ text: 'This should fail' });

        expect(res.status).toBe(401);
    });

    test('✅ Should fetch all posts', async () => {
        const res = await request(app)
            .get('/api/posts')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
