import express from 'express';
import {getUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/user.controller.js';

const router = express.Router();

// Map paths to controller functions
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;