import express from "express";
// this is a react Router.
const router = express.Router();
// controller should handle the functionality of the routes. Routes should do the pointing only.
import {
    getProductById,
    getProducts,
} from "../controllers/productController.js";

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

export default router;
