require('dotenv').config();  // Load environment variables
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');
// Remove VercelRequest and VercelResponse since you don't need them
const { VercelRequest, VercelResponse } = require('@vercel/node');

const app = express();

// Log environment variables for debugging
console.error('VITE_API_URL:', process.env.API_URL);
console.error('Node environment:', process.env.NODE_ENV);
console.error('MongoDB URI:', process.env.MONGO_URI);
console.error('Frontend URI:', process.env.FRONTEND_URL);

// Connect to MongoDB
connectDB();

// Enable CORS for all domains
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON
app.use(express.json());

// Define API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Swagger API Docs
swaggerDocs(app);

// Export app for serverless
module.exports = (req, res) => app(req, res);  // This is what Vercel expects

