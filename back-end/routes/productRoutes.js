import express from "express";
// this is a react Router.
const router = express.Router();
// controller should handle the functionality of the routes. Routes should do the pointing only.
import {
    getProductById,
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, isAdmin, createProduct);
router.route("/top").get(getTopProducts);
router
    .route("/:id")
    .get(getProductById)
    .delete(protect, isAdmin, deleteProduct)
    .put(protect, isAdmin, updateProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
