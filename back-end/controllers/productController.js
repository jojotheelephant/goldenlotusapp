// controller should handle the functionality of the routes. Routes should do the pointing only.

// async handler --  simple middlware for handling exceptions inside of async express routes and passing
// them to your express error handlers.
import asyncHandler from "express-async-handler";
// import the model.
import Product from "../models/productModel.js";

// @desc   Fetch all products
// @route  GET /api/products
// @access public
const getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

export { getProductById, getProducts };
