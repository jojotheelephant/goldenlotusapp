import express from "express";
// this is a react Router.
const router = express.Router();
// controller should handle the functionality of the routes. Routes should do the pointing only.
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
} from "../controllers/orderController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, isAdmin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, isAdmin, updateOrderToDelivered);

export default router;
