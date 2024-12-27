// require response
const { CreatedResponse, SuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

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


// [GET] /api/v1/products/published/all
/**
 * @description Lấy toàn bộ bản đã publish sản phẩm của Shop
 * @param { Number } limit 
 * @param { Number } skip 
 * @return { JSON }
 */
module.exports.getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
        message: "Lấy những bản nháp của sản phẩm",
        metadata: await ProductService.findAllPublishForShop(
            {
                product_shop: req.user.userId // req.user lấy từ authentication-v2
            }
        )
    }).send(res);
}

// [POST] /api/v1/products/isPublish/:id
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

// [POST] /api/v1/products/isUnPublish/:id
module.exports.isUnPublishProduct = async (req, res, next) => {
    const product_id = req.params.id;

    new SuccessResponse({
        message: "UnPublish Sản phẩm",
        metadata: await ProductService.UnPublishProductByShop(
            {
                product_id,
                product_shop: req.user.userId // req.user lấy từ authentication-v2
            }
        )
    }).send(res);
}

// [GET] /api/v1/products/search/:keySearch
module.exports.getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
        message: "Tìm kiếm sản phẩm",
        metadata: await ProductService.searchProduct(req.params)
    }).send(res);
}

// [GET] /api/v1/products/
module.exports.findAllProduct = async (req, res, next) => {
    new SuccessResponse({
        message: "Lấy hết danh sách Sản phẩm",
        metadata: await ProductService.findAllProduct({limit: 50})
    }).send(res);
}

// [GET] /api/v1/products/detail/:id
module.exports.finDetailProduct = async (req, res, next) => {
    new SuccessResponse({
        message: "Lấy chi tiết Sản phẩm",
        metadata: await ProductService.findDetailProduct({
            product_id: req.params.id
        })
    }).send(res);
}

// [PATCH] /api/v1/products/update/:id
module.exports.updateProduct = async ( req, res, next ) => {
    console.log('body::', req.body);
    new SuccessResponse({
        message: "Update Sản phẩm",
        metadata: await ProductService.updateProduct(
            req.body.product_type, // type
            req.params.id, // productId

            // payload
            {
                ...req.body,
                product_shop: req.user.userId
            }
        )
    }).send(res);
}