const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const stream = require('stream');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const storage = multer.memoryStorage(); // Store file in memory to upload to Cloudinary
const upload = multer({ storage: storage }).single('image'); // Single file upload with field name 'image'

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_option: 'debug'
});

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

router.post('/', authMiddleware, upload, async (req, res) => {
    try {
        const { text } = req.body;
        let imageUrl = null;  // Variable to store the image URL after uploading to Cloudinary

        // Check if a file was uploaded
        if (req.file) {
            const mimeType = req.file.mimetype;

            // Only allow JPEG and PNG images
            if (!['image/jpeg', 'image/png'].includes(mimeType)) {
                return res.status(400).json({ message: 'Only JPEG and PNG images are allowed.' });
            }

            // Create a readable stream from the file buffer (to send to Cloudinary)
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            // Upload image to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',  // Set the resource type to image
                        folder: 'social-app',    // Optional: Specify folder in Cloudinary
                        upload_preset: 'social-app',  // Use the custom upload preset you've created
                        public_id: `post-${Date.now()}`,  // Custom public ID, or you can let Cloudinary auto-generate it
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            reject(error);  // Reject the promise if there's an error
                        }
                        resolve(result);  // Resolve with the result if upload is successful
                    }
                ).end(req.file.buffer);  // Pipe the buffer to Cloudinary uploader stream
            });

            // Get the secure URL from Cloudinary's response
            imageUrl = result.secure_url;
        }

        // Create a new post with the image URL
        const newPost = new Post({
            user: req.user.id,
            text,
            image: imageUrl
        });

        // Save the post to the database
        const post = await newPost.save();
        console.log('Post uploaded:', post);

        // Respond with the created post
        res.status(201).json(post);
    } catch (error) {
        console.error('Error during post creation:', error);
        // Ensure that the error response is helpful
        res.status(500).json({ message: 'Server error', error: error.message });
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
router.get('/',authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username") // Populates the post author
            .populate("comments.user", "username") // Populates comment authors
            .sort({ createdAt: -1 })  // Sort by createdAt in descending order (newest first)
            .exec();
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

        console.log('Post liked by: %s', post.user);
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
        console.log('Comment added by: %s', post.user);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
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
 *         description: Post found
 *       404:
 *         description: Post not found
 */

// Get a single post by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "username")
            .populate("comments.user", "username");

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
