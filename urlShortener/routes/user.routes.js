import express from 'express';
import { userSignUp, userLogin } from '../controllers/user.controller.js';
import { signupValidation, loginValidation } from '../middlewares/validators.js';

const router = express.Router();

/**
 * User Routes - Supports both API (JSON) and Web (HTML) responses
 * Content negotiation handled in controller via isApiRequest()
 */

// POST /api/v1/user/register - User registration (JSON or HTML response based on request)
router.post('/register', signupValidation, userSignUp);

// POST /api/v1/user/login - User login (JSON or HTML response based on request)
router.post('/login', loginValidation, userLogin);

export default router;
