const shopRouter = require('./shop.route');

module.exports = (app) => {
    const version = '/api/v1'; // version 1

    app.use(version + `/shop`, shopRouter);

}