const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
    });
};

export default errorMiddleware;