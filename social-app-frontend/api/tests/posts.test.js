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

        // Create a post to test like and comment
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is a test post for like and comment functionality' });

        postId = postRes.body._id; // Store the post ID
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

    // Like a post
    test('✅ Should like a post', async () => {
        const res = await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200);
            expect(res.body.likes).toHaveLength(1); // Post should have one like
    });

    // Prevent liking a post twice
    test('❌ Should not allow liking a post twice', async () => {
        await request(app) // First like (should succeed)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app) // Second like (should fail)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'You have already liked this post');
    });

     // Comment on a post
     test('✅ Should comment on a post', async () => {
        const res = await request(app)
            .post(`/api/posts/${postId}/comment`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'This is a test comment' });

        expect(res.status).toBe(201); // Created status
        expect(res.body).toHaveProperty('_id');
        expect(res.body.comments).toHaveLength(1); // Post should have one comment
        expect(res.body.comments.some(comment => comment.text === "This is a test comment"));

    });
});
