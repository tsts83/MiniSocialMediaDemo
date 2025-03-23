require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');

const app = express();

console.error('VITE_API_URL:', process.env.API_URL);
console.error('Node environment:', process.env.NODE_ENV);
console.error('MongoDB URI:', process.env.MONGO_URI);
console.error('Frontend URI:', process.env.FRONTEND_URL);


// Swagger API Docs
swaggerDocs(app);



// Export the Express app as a serverless function
module.exports = (req, res) => {
    return app(req, res);
};