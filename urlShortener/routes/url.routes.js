import express from 'express';
import { createShortUrl, deleteUrl, getAllUrls } from '../controllers/url.controller.js';
import { createUrlValidation, shortIdValidation } from '../middlewares/validators.js';

const router = express.Router();

/**
 * URL Routes - Supports both API (JSON) and Web (HTML) responses
 * Content negotiation handled in controller via isApiRequest()
 */

// GET /api/v1/url - Get all URLs (JSON response)
router.get('/', getAllUrls);

// POST /api/v1/url - Create short URL (JSON or HTML response based on request)
router.post('/', createUrlValidation, createShortUrl);

// DELETE /api/v1/url/:shortId - Delete URL (JSON response only)
router.delete('/:shortId', shortIdValidation, deleteUrl);

export default router;
