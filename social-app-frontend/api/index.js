require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');

const app = express();

// Connect to DB
connectDB();

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow sending credentials (cookies, auth headers)
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Swagger API Docs
swaggerDocs(app);

// If we're not running on Vercel, start the server locally
if (process.env.NODE_ENV == 'development') {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

// Export the Express app as a serverless function
module.exports = (req, res) => {
    return app(req, res);
};

// Export app for testing
module.exports = app;