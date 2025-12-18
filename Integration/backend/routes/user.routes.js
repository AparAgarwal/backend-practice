import express from "express";
import {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route('/')
      .get(getAllUser)
      .post(createUser);

router.route('/:id')
      .get(getUserById)
      .patch(updateUser)
      .delete(deleteUser);

export default router;