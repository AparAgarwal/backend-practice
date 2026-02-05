import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Node.js Database Intro! API is up and running.');
});

export default router;