import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import {
    getAllUsersController,
    // getSingleUserController
} from '../controllers/userController.js';

const router = express.Router();

// Ruta pentru a prelua toți utilizatorii
router.get("/get-users", requireSignIn, isAdmin, getAllUsersController);


// //single product
// router.get("/get-user/:userId", getSingleUserController);

export default router;
