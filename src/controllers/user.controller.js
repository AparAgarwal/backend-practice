import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const createUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const newUser = await User.create({ name, email });
    return res.status(201).json(new ApiResponse(201, newUser, "User created successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});