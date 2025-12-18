import express from 'express';
import {
    createShortUrl,
    redirectToUrl,
} from '../controllers/url.controller.js';

const router = express.Router();

router.route("/shorten").post(createShortUrl);

router.route("/:shortId").get(redirectToUrl);

export default router;