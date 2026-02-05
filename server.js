import app from "./src/app.js";
import connectDB from './src/config/db.js';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database', error);
});