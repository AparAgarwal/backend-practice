import express from 'express';
import userRoutes from './routes/user.routes.js';
import staticRoutes from './routes/static.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// User Routes - much cleaner
app.use('/users', userRoutes);

// Static Route
app.use('/', staticRoutes);

export default app;