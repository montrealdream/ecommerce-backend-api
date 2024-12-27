// Các Status Code Error
const StatusCode = {
    INTERNAL_SERVER_ERROR: 500,
}

// Lý do cho các Status Code
const ReasonStatusCode = {
    INTERNAL_SERVER_ERROR: "Internal Server Error",
}

module.exports = (app) => {
    
    // middleware này sẽ nhận các lỗi từ router (tức chưa vào controller hay middleware) mà sẽ không detect được cái router
    app.use( (req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    })
    
    // router nãy sẽ nhận các lỗi được ném (throw new ...) từ middleware hay controller ra
    app.use( (error, req, res, next) => {
        const statusCode = error.status || StatusCode.INTERNAL_SERVER_ERROR; // 500 Lỗi server
        return res.status(statusCode).json({
            status: 'error',
            code: statusCode,
            stack: error.stack, // log ra dòng nào lỗi
            message: error.message || ReasonStatusCode.INTERNAL_SERVER_ERROR // Internal Server Error Là Lỗi Server
        })
    });
}