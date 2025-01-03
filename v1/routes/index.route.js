// require router
const shopRouter = require('./shop.route');
const productRouter = require('./product.route');
const discountRouter = require('./discount.route');
const checkoutRouter = require('./checkout.route');
const cartRouter = require('./cart.route');

// require middleware
const apiKeyMiddleware = require('../middleware/apiKey.middleware');

module.exports = (app) => {
    const version = '/api/v1'; // version 1
    
    // Kiểm tra API KEY
    app.use(apiKeyMiddleware.requiredApiKey);

    // Kiểm tra Permission
    app.use(apiKeyMiddleware.requiredPermission('0000'));

    // Route
    app.use(version + `/cart`, cartRouter);

    app.use(version + `/products`, productRouter);

    app.use(version + `/shop`, shopRouter);

    app.use(version + `/discount`, discountRouter);

    app.use(version + `/checkout`, checkoutRouter);
}