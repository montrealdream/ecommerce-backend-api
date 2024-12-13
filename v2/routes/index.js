const shopRouter = require('./shop.route');

module.exports = (app) => {
    const version = '/api/v2'; // version 2

    app.use(version + `/shop`, shopRouter);

}