import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';

const trimRefreshTokens = (user) => {
    const max = Number(process.env.MAX_REFRESH_TOKENS) || 5;
    if (max <= 0 || user.refreshTokens.length <= max) {
        return;
    }

    user.refreshTokens = user.refreshTokens
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-max);
};

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -refreshTokens'); // Exclude password and refreshTokens from response
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -refreshTokens'); // Exclude password and refreshTokens from response
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const registerUser = asyncHandler(async (req, res) => {
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
    delete userResponse.refreshTokens;

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
    delete userResponse.refreshTokens;

    return res.status(200).json(new ApiResponse(200, userResponse, "User details updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid Credentials");
    }

    // Generate both Access Token (short-lived) and Refresh Token (long-lived)
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshTokens.push({ token: refreshToken });
    trimRefreshTokens(user); // Enforce max active sessions limit
    await user.save();

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshTokens;

    return res.status(200).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { user: userResponse, accessToken }, "Logged In Successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    // Prefer the values set by `refreshAuthenticate` middleware
    const incomingRefreshToken = req.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing. Login again.");
    }

    // Use user doc attached by middleware
    const user = req.userDoc;
    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    // Rotate refresh token: remove used, issue new
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== incomingRefreshToken);
    const newRefreshToken = user.generateRefreshToken();
    user.refreshTokens.push({ token: newRefreshToken });
    trimRefreshTokens(user); // Keep under max active sessions
    await user.save();

    const accessToken = user.generateAuthToken();

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    };

    res.cookie('refreshToken', newRefreshToken, options);
    return res.status(200).json(new ApiResponse(200, { accessToken }, "Access token generated"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    let user = null;

    if (req.user?.userId) {
        user = await User.findById(req.user.userId);
    }

    if (user && incomingRefreshToken) {
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== incomingRefreshToken);
        await user.save();
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    }

    res.clearCookie('refreshToken', options);
    return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password -refreshTokens');

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully."))
});

// avatar upload 
export const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No image uploaded');
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(200).json(
        new ApiResponse(200, { url: fileUrl }, 'Avatar uploaded successfully')
    );
});