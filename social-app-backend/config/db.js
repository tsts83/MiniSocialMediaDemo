const mongoose = require('mongoose');

// In db.js or test setup
if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
}

const mongoUri = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

console.log('Connecting to MongoDB with URI:', mongoUri); 

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error, mongoUri);
        process.exit(1);
    }
};

module.exports = connectDB;
