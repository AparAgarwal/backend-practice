// models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    refreshTokens: [
        {
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();

    // Check if password is being modified
    if (update.$set && update.$set.password) {
        const salt = await bcrypt.genSalt(10);
        update.$set.password = await bcrypt.hash(update.$set.password, salt);
    }
});

userSchema.methods.comparePassword = async function (pass) {
    return await bcrypt.compare(pass, this.password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            userId: this._id,
            email: this.email,
            username: this.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '15m' }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRY || '7d' }
    );
};

const User = mongoose.model('User', userSchema);
export default User;