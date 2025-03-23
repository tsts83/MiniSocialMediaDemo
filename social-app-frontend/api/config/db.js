const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;

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
