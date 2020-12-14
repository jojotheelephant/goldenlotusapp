import express from "express";
// this is a react Router.
const router = express.Router();
// controller should handle the functionality of the routes. Routes should do the pointing only.
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

// protect is an authMiddleware that encrypts the transmission of data.
router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.post("/login", authUser);
router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route("/:id")
    .delete(protect, deleteUser)
    .get(protect, isAdmin, getUserById)
    .put(protect, isAdmin, updateUser);

export default router;
