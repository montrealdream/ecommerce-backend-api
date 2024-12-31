// service
const CartService = require('../services/cart.service');

// require response
const { CreatedResponse, SuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

// []
module.exports.addToCart = async (req, res, next) => {
    new SuccessResponse({
        message: "Thêm sản phẩm vào giỏ hàng",
        metadata: await CartService.addToCart({ ...req.body })
    }).send(res);
}

module.exports.update = async (req, res, next) => {
    new SuccessResponse({
        message: "update  sản phẩm trong giỏ hàng",
        metadata: await CartService.addToCartV2({
            ...req.body
        })
    }).send(res);
}

module.exports.delete = async (req, res, next) => {
    new SuccessResponse({
        message: "Delete sản phẩm khỏi giỏ hàng",
        metadata: await CartService.deleteUserCart({ ...req.body })  
    }).send(res);
}

module.exports.list = async (req, res, next) => {
    new SuccessResponse({
        message: "Lấy danh sách sản phẩm",
        metadata: await CartService.getListCart( req.query )
    }).send(res);
}