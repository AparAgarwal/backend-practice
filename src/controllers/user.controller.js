import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password'); // Exclude password from response
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password from response
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const createUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!name || !username || !email || !password || !confirmPassword) {
        throw new ApiError(400, 'All fields are required');
    }
    
    if (password !== confirmPassword) {
        throw new ApiError(400, 'Passwords do not match');
    }
    
    if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters long');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    
    if (existingUser) {
        throw new ApiError(409, 'User with this email or username already exists');
    }
    
    // Create new user (password will be hashed automatically by pre-save hook)
    const user = await User.create({
        name,
        username,
        email,
        password
    });
    
    // Remove sensitive fields before responding
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(201).json(
        new ApiResponse(201, userResponse, 'User registered successfully')
    );
});

export const updateUser = asyncHandler(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "No update data provided");
    }

    const allowedUpdates = ["name", "email", "password"];
    const updates = {};

    for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields to update");
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(new ApiResponse(200, userResponse, "User details updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});