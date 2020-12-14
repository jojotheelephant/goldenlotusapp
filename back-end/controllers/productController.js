// controller should handle the functionality of the routes. Routes should do the pointing only.

// async handler --  simple middlware for handling exceptions inside of async express routes and passing
// them to your express error handlers.
import asyncHandler from "express-async-handler";
// import the model.
import Product from "../models/productModel.js";

// @desc   Fetch all products
// @route  GET /api/products
// @access public
// has search parameters built in. search by name, brand, category and description
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 25;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              $or: [
                  {
                      name: {
                          $regex: req.query.keyword,
                          $options: "i",
                      },
                  },
                  {
                      brand: {
                          $regex: req.query.keyword,
                          $options: "i",
                      },
                  },
                  {
                      category: {
                          $regex: req.query.keyword,
                          $options: "i",
                      },
                  },
                  {
                      description: {
                          $regex: req.query.keyword,
                          $options: "i",
                      },
                  },
              ],
          }
        : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        count,
        pageSize,
    });
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

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access private/admin
const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc   Create a product
// @route  POST /api/products/
// @access private/admin
const createProduct = asyncHandler(async (req, res, next) => {
    const product = new Product({
        name: "Sample Name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sameple Brand",
        category: "Sample Category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample Description",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc   Update a product
// @route  PUT /api/products/:id
// @access private/admin
const updateProduct = asyncHandler(async (req, res, next) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product Not Found.");
    }
});

// @desc   Create new Review
// @route  POST /api/products/:id/reviews
// @access private
const createProductReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error("You have already reviewed this product");
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review Added" });
    } else {
        res.status(404);
        throw new Error("Product Not Found.");
    }
});

// @desc   Get Top rated products
// @route  GET /api/products/top
// @access private
const getTopProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
});

export {
    getProductById,
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
};
