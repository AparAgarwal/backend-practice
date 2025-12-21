import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            select: false // Exclude password from queries by default
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
