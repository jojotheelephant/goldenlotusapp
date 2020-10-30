// --- ERROR HANDLING --- (bottom of code)
// Error handling middleware if a route is not found. Creates a new error object and passes to next error handler.
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
// This error handler chceks of status is 200 (sometimes happens) and assigns it to 500. Responds to client with json.
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export { notFound, errorHandler };
