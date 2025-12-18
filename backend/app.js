import express from 'express';
import userRoutes from './routes/user.routes.js';
import connectDB from './config/db.js';

const app = express();

// DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server successfully running.');
});

app.use('/api/users', userRoutes);

export default app;