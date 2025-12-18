import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;

// connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected!");
    } catch (err) {
        console.log("Error connecting MongoDB", err);
    }
}

export default connectDB;