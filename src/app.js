import express from 'express';
import userRoutes from './routes/user.routes.js';
import staticRoutes from './routes/static.routes.js';
import {requestLogger} from './middlewares/logger.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Use custom middleware for logging requests
app.use(requestLogger);

// User Routes - much cleaner
app.use('/users', userRoutes);

// Static Route
app.use('/', staticRoutes);

export default app;