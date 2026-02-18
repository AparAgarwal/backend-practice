import express from 'express';
import { getUsers, getUserById, registerUser, updateUser, deleteUser, loginUser, refreshAccessToken, logoutUser, getCurrentUser, uploadAvatar } from '../controllers/user.controller.js';
import { authenticate, refreshAuthenticate } from '../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../config/upload.js';

const router = express.Router();

// Public Routes - No authentication required
router.post('/register', registerUser);
router.post('/login', loginUser);

// Refresh Token Routes - Requires valid refresh token in cookie
router.post('/refresh', refreshAuthenticate, refreshAccessToken);

// Protected Routes - Require valid Access Token
router.post('/logout', authenticate, logoutUser);
router.get('/me', authenticate, getCurrentUser);

// Avatar - upload route
router.post('/avatar', authenticate, uploadSingleImage, uploadAvatar);

// CRUD Routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;