// const express = require("express"); import using es2015
import express from "express";
// const dotenv = require("dotenv"); import using es2015
import dotenv from "dotenv";
// const connectDB = require('./config/db.js'). This is the mongoose module that connects to MongoDB.
import connectDB from "./config/db.js";
// import productRoutes
import productRoutes from "./routes/productRoutes.js";
// bring in the error handling middleware
import { notFound, errorHandler } from "./middleware/errormiddleware.js";

// allows for calls to process.env variables stored in .env file
dotenv.config();

// connect to database
connectDB();

// start express and naming app
const app = express();

// set PORT using process.env
const PORT = process.env.PORT || 5000;

// GET method for '/' reoute to server
app.get("/", (req, res, next) => {
    res.send("API is running...");
});

// ---ROUTES---
app.use("/api/products", productRoutes);

// --- ERROR HANDLING --- (bottom of code)
// Error handling middleware if a route is not found. Creates a new error object and passes to next error handler.
app.use(notFound);
// This error handler chceks of status is 200 (sometimes happens) and assigns it to 500. Responds to client with json.
app.use(errorHandler);

// start listening
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
