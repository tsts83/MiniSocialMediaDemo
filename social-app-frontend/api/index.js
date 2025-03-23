require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');
// Comment the following line when running backend locally
// const { VercelRequest, VercelResponse } = require('@vercel/node');

const app = express();

// Log environment variables for debugging purposes
console.error('VITE_API_URL:', process.env.API_URL);
console.error('Node environment:', process.env.NODE_ENV);
console.error('MongoDB URI:', process.env.MONGO_URI);
console.error('Frontend URI:', process.env.FRONTEND_URL);

// If any of these values are missing, throw an error to stop execution
if (!process.env.API_URL || !process.env.NODE_ENV || !process.env.MONGO_URI || !process.env.FRONTEND_URL) {
    throw new Error('Critical environment variables are missing!');
}

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes and other configurations
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));
// swaggerDocs(app);

module.exports = app;
