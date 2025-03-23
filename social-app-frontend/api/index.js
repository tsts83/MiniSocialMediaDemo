require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');
//const { VercelRequest, VercelResponse } = require('@vercel/node');

const app = express();

// Connect to DB
connectDB();

// Enable CORS
app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Swagger API Docs
swaggerDocs(app);

// If we're not running on Vercel, start the server locally
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5002;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Instead, export the Express app as a serverless function
module.exports = (req, res) => {
    return app(req, res);
};