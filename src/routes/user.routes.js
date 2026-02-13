import express from 'express';
import {getUsers, getUserById, registerUser, updateUser, deleteUser, loginUser} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Map paths to controller functions
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;