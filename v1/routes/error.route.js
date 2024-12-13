module.exports = (app) => {
    app.use( (req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        console.log(`[5]::Throw BadRequestError ${error}`);
        next(error);
    })
    
    app.use( (error, req, res, next) => {
        console.log(`[6]::Throw BadRequestError ${error}`);

        const statusCode = error.status || 500; // 500 Lỗi server
        return res.status(statusCode).json({
            status: 'error',
            code: statusCode,
            message: error.message || 'Internal Server Error' // Internal Server Error Là Lỗi Server
        })
    });
}