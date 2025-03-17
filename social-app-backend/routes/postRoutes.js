const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This is my first post!"
 *     responses:
 *       200:
 *         description: Post created successfully
 */

// Create a post
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({ user: req.user.id, text: req.body.text });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['username']);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/posts/{id}/like:
 *   put:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 */

// Like a post
router.put('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.id)) {
            post.likes.push(req.user.id);
            await post.save();
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/posts/{id}/comment:
 *   post:
 *     summary: Comment on a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Nice post!"
 *     responses:
 *       200:
 *         description: Comment added successfully
 */

// Comment on a post
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ user: req.user.id, text: req.body.text });
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
