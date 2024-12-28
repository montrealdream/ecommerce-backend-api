// require response
const { CreatedResponse, SuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

// service
// const ProductService = require('../services/product.service');
const DiscountService = require('../services/discount.service');

// [POST] /api/v1/discount/create
module.exports.createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
        message: "Tạo mới Discount Code",
        metadata: await DiscountService.createDiscountCode({
            ...req.body,
            discount_shopId: req.user.userId // user 
        })
    }).send(res);
}

// // // [GET]
// // module.exports.getAllDiscountByShop = async (req, res, next) => {
// //     new SuccessResponse({
// //         message: "Tìm tất cả DiscountCode của Shop",
// //         metadata: await DiscountService.getAllDiscountByShop({
// //             ...req.query,
// //             shopId: req.user.userId // user 
// //         })
// //     }).send(res);
// // }

// [GET] /api/v1/discount/list_product_code
module.exports.getAllDiscountCodeWithProduct = async (req, res, next) => {
    new SuccessResponse({
        message: "Lấy tất cả Product có thể áp dụng mã code này hê hê",
        metadata: await DiscountService.getAllDiscountCodeWithProduct({
            ...req.query,
        })
    }).send(res);
}

// // // [GET]
module.exports.getDiscountAmout = async (req, res, next) => {
    new SuccessResponse({
        message: "Tìm tất cả DiscountCode của Shop",
        metadata: await DiscountService.getDiscountAmout({
            ...req.body,
        })
    }).send(res);
}

