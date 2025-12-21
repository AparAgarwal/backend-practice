import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Connect to MongoDB with retry logic
 * @param {number} retryCount - Current retry attempt
 */
const connectDB = async (retryCount = 0) => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log('✓ MongoDB connected successfully!');
        console.log(`  Host: ${conn.connection.host}`);
        console.log(`  Database: ${conn.connection.name}`);
    } catch (err) {
        console.error(
            `✗ Error connecting to MongoDB (Attempt ${retryCount + 1}/${MAX_RETRIES}):`,
            err.message
        );

        if (retryCount < MAX_RETRIES - 1) {
            console.log(`  Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
            setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY_MS);
        } else {
            console.error('✗ Max retry attempts reached. Please check your MONGO_URI in .env file');
            console.error('  Application cannot start without database connection');
            process.exit(1); // Exit with failure
        }
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', err => {
    console.error('✗ MongoDB connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('\n✓ MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('✗ Error during MongoDB disconnection:', err);
        process.exit(1);
    }
});

export default connectDB;
