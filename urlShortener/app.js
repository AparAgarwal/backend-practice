import express from 'express';
import connectDB from './config/db.js';
import urlRoutes from './routes/url.routes.js';

const app = express();
connectDB();

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.route('/', (req, res)=>{
    return res.send("Server successfully connected!");
})

app.use('/', urlRoutes);

export default app;