import express from 'express';
import {getUsers, createUser, deleteUser} from '../controllers/user.controller.js';

const router = express.Router();

// Map paths to controller functions
router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;