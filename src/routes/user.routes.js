import express from 'express';
import { getUsers, getUserById, registerUser, updateUser, deleteUser, loginUser, refreshAccessToken, logoutUser, getCurrentUser, uploadAvatar } from '../controllers/user.controller.js';
import { authenticate, refreshAuthenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { userRegistrationSchema, userLoginSchema, userUpdateSchema } from '../schema/user.schema.js';
import { uploadSingleImage } from '../config/upload.js';

const router = express.Router();

// Public Routes - No authentication required
router.post('/register', validate(userRegistrationSchema), registerUser);
router.post('/login', validate(userLoginSchema), loginUser);

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
router.patch('/:id', validate(userUpdateSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;