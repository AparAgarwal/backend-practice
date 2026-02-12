// models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    password:{
        type: String,
        required: true,
        minLength: 8
    }
}, {timestamps: true});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    
    // Check if password is being modified
    if (update.$set && update.$set.password) {
        const salt = await bcrypt.genSalt(10);
        update.$set.password = await bcrypt.hash(update.$set.password, salt);
    }
});

const User = mongoose.model('User', userSchema);
export default User;