import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

export const authenticate = asyncHandler(async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Access denied. No token provided.');
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded;

        // Continue to next middleware/controller
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token has expired. Please login again.');
        }
        throw new ApiError(401, 'Invalid token. Access denied.');
    }
});

export const refreshAuthenticate = asyncHandler(async (req, res, next) => {
    const incoming = req.cookies?.refreshToken;
    if (!incoming) {
        throw new ApiError(401, 'Refresh token missing. Please login again.');
    }

    try {
        const decoded = jwt.verify(incoming, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const found = user.refreshTokens.some(t => t.token === incoming);
        if (!found) {
            throw new ApiError(401, 'Refresh token revoked or invalid');
        }

        // Attach useful info for controller (user doc and raw token)
        req.user = decoded;
        req.userDoc = user;
        req.refreshToken = incoming;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Refresh token expired. Please login again.');
        }
        throw new ApiError(401, 'Invalid refresh token');
    }
});