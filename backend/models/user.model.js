import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    gender: {
        type: String,
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;