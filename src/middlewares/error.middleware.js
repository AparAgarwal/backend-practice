import { ApiError } from "../utils/ApiError.js";
import multer from 'multer';

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                statusCode: 400,
                message: 'File too large. Max 2MB allowed.'
            });
        }
    }

    // If the error isn't already an ApiError, wrap it so it's consistent
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error?.errors, err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        // Pro-tip: Only show the stack trace in development mode!
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorHandler };