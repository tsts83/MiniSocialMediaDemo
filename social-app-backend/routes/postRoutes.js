const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const fs = require('fs');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


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
 *     description: Create a post with an optional image upload.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { text } = req.body;
        let imageBase64 = null;

        // Convert uploaded image to Base64 if provided
        if (req.file) {
            const imagePath = `uploads/${req.file.filename}`;
            const image = fs.readFileSync(imagePath);
            imageBase64 = image.toString('base64');
            // You may want to delete the image after conversion
            fs.unlinkSync(imagePath);
        }

        const newPost = new Post({
            user: req.user.id,
            text,
            image: imageBase64 || null
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

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
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        post.likes.push(req.user.id);
        await post.save();

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
 *       201:
 *         description: Comment added successfully
 */

// Comment on a post
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ user: req.user.id, text: req.body.text });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
