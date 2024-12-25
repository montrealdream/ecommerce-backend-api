// require response
const { CreatedResponse, SuccessResponse } = require('../core/success.response');

// service
// const ProductService = require('../services/product.service');
const ProductService = require('../services/product.service.advance');

// [POST] /api/v1/products/create
module.exports.createProduct = async (req, res, next) => {
    new SuccessResponse({
        message: "Tạo mới sản phẩm success",
        metadata: await ProductService.createProduct(
            req.body.product_type, 
            {
                ...req.body,
                product_shop: req.user.userId // req.user lấy từ authentication-v2
            }
        )
    }).send(res);
}