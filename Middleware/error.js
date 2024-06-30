const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500; // Default to 500 if no status code is set
    let errors = err.message || 'Internal Server Error';

    if (statusCode === 413) {
        errors = "image  to large reduce its size "
        statusCode=400
    }
    if (err.code === 11000) {
        const error = Object.keys(err.keyPattern).join(",");
        err.errors = ` duplicate field  ${error}`;
        err.statusCode = 400
    }
    if (err.name === "CastError") {
        const path = err.path
        err.errors = `invaild format  ${path}`;
        err.statusCode = 400
    }
    res.status(statusCode).json({
        success: false,
        errors: errors,
        statusCode:statusCode

    });
};

module.exports = errorMiddleware;