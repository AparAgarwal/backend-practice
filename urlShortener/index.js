import app from './app.js';
import 'dotenv/config';
import validateEnv from './utils/validateEnv.js';

// Validate environment variables before starting the server
validateEnv();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
