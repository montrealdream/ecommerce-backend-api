// require response
const { CreatedResponse, SuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

// service
// const ProductService = require('../services/product.service');
const CheckoutService = require('../services/checkout.service');

// [POST] /api/v1/checkout/create
module.exports.checkoutReview = async (req, res, next) => {
    new SuccessResponse({
        message: "Review giỏ hàng",
        metadata: await CheckoutService.checkoutReview( req.body )
    }).send(res);
}

