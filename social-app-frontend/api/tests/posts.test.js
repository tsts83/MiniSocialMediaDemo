// api/tests/posts.test.js
const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

describe('Posts API', () => {
    let token;
    let userId;

    async function createTestPost(token) {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Isolated test post' });

        console.log("🧾 Created postId:", res.body._id);
        return res.body._id;
    }

    const waitForPost = async (postId, token, retries = 5) => {
        for (let i = 0; i < retries; i++) {
            const res = await request(app)
                .get(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`)
    
            console.log("🔍 Waiting for post:", res.status, res.body);
            if (res.status === 200 && res.body._id === postId) return;
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        throw new Error("Post not found after creation.");
    };



    afterEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
    });
    

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);

        const userRes = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });

        token = userRes.body.token;
        userId = userRes.body.user.id;
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

    test('❌ Should not allow liking a post twice', async () => {
        const postId = await createTestPost(token);
        await waitForPost(postId,token);

        // First like
        await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        // Second like
        const res = await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        console.log("🔥 Second like response:", res.body);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'You have already liked this post');
    });

    test('✅ Should comment on a post', async () => {
        const postId = await createTestPost(token);
        await waitForPost(postId,token);

        console.log("📝 Commenting on postId:", postId);
        const res = await request(app)
            .post(`/api/posts/${postId}/comment`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is a test comment' });

        console.log("💬 Comment response:", res.body);
        expect(res.status).toBe(201);
        expect(res.body.comments).toHaveLength(1);
        expect(res.body.comments[0].text).toBe("This is a test comment");
    });

    test('✅ Should like a post', async () => {
        const postId = await createTestPost(token);
        await waitForPost(postId,token);

        console.log("👍 Liking postId:", postId);
        const res = await request(app)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        console.log("🧪 Like response:", res.status, res.body);

        expect(res.status).toBe(200);
        expect(res.body.likes).toContain(userId);
    });
    
});
