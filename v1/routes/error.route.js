// Các Status Code Error
const StatusCode = {
    INTERNAL_SERVER_ERROR: 500,
}

// Lý do cho các Status Code
const ReasonStatusCode = {
    INTERNAL_SERVER_ERROR: "Internal Server Error",
}

module.exports = (app) => {
    app.use( (req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        console.log(`[5]::Throw BadRequestError ${error}`);
        next(error);
    })
    
    app.use( (error, req, res, next) => {
        console.log(`[6]::Throw BadRequestError ${error}`);

        const statusCode = error.status || StatusCode.INTERNAL_SERVER_ERROR; // 500 Lỗi server
        return res.status(statusCode).json({
            status: 'error',
            code: statusCode,
            message: error.message || ReasonStatusCode.INTERNAL_SERVER_ERROR // Internal Server Error Là Lỗi Server
        })
    });
}