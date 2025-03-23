require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerDocs = require('./config/swagger');

const app = express();  // Create the app instance

// Connect to DB
connectDB();

// Enable CORS
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Swagger API Docs
swaggerDocs(app);

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 5002, () => {
        console.log(`Server running on port ${process.env.PORT || 5002}`);
    });
}

module.exports = app;  // Export the app for testing
