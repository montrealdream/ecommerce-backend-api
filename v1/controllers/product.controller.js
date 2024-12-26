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

// [GET] /api/v1/products/drafts/all
/**
 * @description Lấy toàn bộ bản nháp sản phẩm của Shop
 * @param { Number } limit 
 * @param { Number } skip 
 * @return { JSON }
 */
module.exports.getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
        message: "Lấy những bản nháp của sản phẩm",
        metadata: await ProductService.findAllDraftForShop(
            {
                product_shop: req.user.userId // req.user lấy từ authentication-v2
            }
        )
    }).send(res);
}

// [GET] /api/v1/products/isPublish/:id
module.exports.isPublishProduct = async (req, res, next) => {
    const product_id = req.params.id;

    new SuccessResponse({
        message: "Publish Sản phẩm",
        metadata: await ProductService.publishProductByShop(
            {
                product_id,
                product_shop: req.user.userId // req.user lấy từ authentication-v2
            }
        )
    }).send(res);
}