// require service
const AccessService = require('../services/access.service');

// require response
const { CreatedResponse, SuccessResponse } = require('../core/success.response');

// [POST] /api/v1/shop/signup
module.exports.signUp = async (req, res) => {
    // cách [CHUẨN] 
    new CreatedResponse({
        message: 'Tạo Tài Khoản Shop Thành Công',
        metadata: await AccessService.signUp(req.body)
    }).send(res);

    // cách [2] cách này chưa chuẩn đâu
    // res.status(200).json(await AccessService.signUp(req.body));

    // cách [1] bỏ try catch
    // try {
    //     // 200 OK
    //     // 201 CREATED
        
    //     console.log(`[Params]::signUp::`, req.body);

    //     res.status(200).json(await AccessService.signUp(req.body));
    // }
    // catch (error) {
    //     return res.status(200).json({
    //         code: 404,
    //         message: error.message,
    //         status: 'error'
    //     });
    // }
}

// [POST] /api/v1/shop/login
module.exports.login = async (req, res) => {
    new SuccessResponse({
        message: 'Login::OK',
        metadata: await AccessService.login(req.body)
    }).send(res);
}

// [POST] /api/v1/shop/logout
module.exports.logout = async (req, res) => {
    new SuccessResponse({
        messasge: 'Logout::OK',
        metadata: await AccessService.logout({ keyStore: req.keyStore })
    }).send(res);
}