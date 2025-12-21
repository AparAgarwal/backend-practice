import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants.js';

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

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
    next();
})

userSchema.methods.comparePassword = async function(pass){
    return bcrypt.compare(pass, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;
