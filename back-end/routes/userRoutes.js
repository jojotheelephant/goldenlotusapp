import express from "express";
// this is a react Router.
const router = express.Router();
// controller should handle the functionality of the routes. Routes should do the pointing only.
import {
    authUser,
    registerUser,
    getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile);

export default router;
