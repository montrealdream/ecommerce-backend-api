// require router
const shopRouter = require('./shop.route');

// require middleware
const apiKeyMiddleware = require('../middleware/apiKey.middleware');

module.exports = (app) => {
    const version = '/api/v1'; // version 1
    
    // Kiểm tra API KEY
    app.use(apiKeyMiddleware.requiredApiKey);

    // Kiểm tra Permission
    app.use(apiKeyMiddleware.requiredPermission('0000'));

    // Route
    app.use(version + `/shop`, shopRouter);
}