// import path
import path from "path";
// const express = require("express"); import using es2015
import express from "express";
// const dotenv = require("dotenv"); import using es2015
import dotenv from "dotenv";
// const connectDB = require('./config/db.js'). This is the mongoose module that connects to MongoDB.
import connectDB from "./config/db.js";
// import morgan to log
import morgan from "morgan";
// import productRoutes
import productRoutes from "./routes/productRoutes.js";
// import userRoutes
import userRoutes from "./routes/userRoutes.js";
// import orderRoutes
import orderRoutes from "./routes/orderRoutes.js";
// import uploadRoutes
import uploadRoutes from "./routes/uploadRoutes.js";
// bring in the error handling middleware
import { notFound, errorHandler } from "./middleware/errormiddleware.js";

// allows for calls to process.env variables stored in .env file
dotenv.config();

// connect to database
connectDB();

// start express and naming app
const app = express();

// middleware - morgan to log activities
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// allows for acceptance of JSON data in body of requests
app.use(express.json());

// set PORT using process.env
const PORT = process.env.PORT || 5000;

// ---ROUTES---
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
// route to upload pictures to the upload folder
app.use("/api/upload", uploadRoutes);
// route for paypal API
app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

// STATIC FILES:
// upload folder to become static
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// set front end to static when in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
} else {
    // GET method for '/' route to server
    app.get("/", (req, res, next) => {
        res.send("API is running...");
    });
}

// --- ERROR HANDLING --- (bottom of code)
// Error handling middleware if a route is not found. Creates a new error object and passes to next error handler.
app.use(notFound);
// This error handler chceks of status is 200 (sometimes happens) and assigns it to 500. Responds to client with json.
app.use(errorHandler);

// start listening
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
