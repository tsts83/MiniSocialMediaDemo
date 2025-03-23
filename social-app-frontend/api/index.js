require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');
//Comment the following line when running backend locally
//const { VercelRequest, VercelResponse } = require('@vercel/node');

const app = express();

// Connect to DB
connectDB();

// CORS setup
const corsOptions = {
    origin: process.env.API_URL,  // Allow only your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));  // Use the CORS middleware with the defined options

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

console.log('VITE_API_URL:', process.env.API_URL);
console.log('Node environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGO_URI);

// Swagger API Docs
swaggerDocs(app);

// If we're not running on Vercel, start the server locally
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Instead, export the Express app as a serverless function
module.exports = (req, res) => {
    return app(req, res);
};

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;