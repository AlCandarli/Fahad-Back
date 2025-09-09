const mongoose = require("mongoose");

// Global cache for serverless environments
let cachedConnection = null;

const connectDB = async () => {
    // If we have a cached connection and it's still connected, return it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached database connection');
        return cachedConnection;
    }

    try {
        console.log('Establishing new database connection...');

                const conn = await mongoose.connect(process.env.DATABASE_URL);
        cachedConnection = conn;
        console.log('Successfully connected to MongoDB');

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('Database connection error:', err);
            cachedConnection = null;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
            cachedConnection = null;
        });

        return conn;
    } catch (err) {
        console.error('Failed to connect to database:', err);
        cachedConnection = null;
        throw err;
    }
};

module.exports = connectDB;