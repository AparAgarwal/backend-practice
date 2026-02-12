import express from 'express';
import userRoutes from './routes/user.routes.js';
import staticRoutes from './routes/static.routes.js';
import {requestLogger} from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Use custom middleware for logging requests
app.use(requestLogger);

// User Routes - much cleaner
app.use('/users', userRoutes);

// Static Route
app.use('/', staticRoutes);

// --- ERROR HANDLING ---
// 1. 404 Handler: If request hits this point, no route matched
app.use((req, res, next) => { next(new ApiError(404, "Page not found")); });
// Global Error Handler - should be the last middleware
app.use(errorHandler);

export default app;