const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

describe('Posts API', () => {
    let token;
    let userId;

    // Helper function to create a post for each test
    async function createTestPost(token) {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Isolated test post' });

        console.log("🧾 Created postId:", res.body.id);
        return res.body._id;
    }

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
        console.log("🧹 Cleaning up test database...");
        await User.deleteMany({});
        await Post.deleteMany({});
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    test('✅ Should create a post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is a test post' });

        console.log("📬 Post creation response:", res.body);
        expect(res.status).toBe(201);
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

    test('✅ Should like a post', async () => {
        const postId = await createTestPost(token);

        const res = await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.likes).toHaveLength(1);
    });

    test('❌ Should not allow liking a post twice', async () => {
        const postId = await createTestPost(token);

        await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        console.log("🔥 Second like response:", res.body);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'You have already liked this post');
    });

    test('✅ Should comment on a post', async () => {
        const postId = await createTestPost(token);

        const res = await request(app)
            .post(`/api/posts/${postId}/comment`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is a test comment' });

        console.log("💬 Comment response:", res.body);
        expect(res.status).toBe(201);
        expect(res.body.comments).toHaveLength(1);
        expect(res.body.comments.some(comment => comment.text === "This is a test comment")).toBe(true);
    });
});
