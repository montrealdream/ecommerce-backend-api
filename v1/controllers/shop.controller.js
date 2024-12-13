// require
const AccessService = require('../services/access.service');

// [POST] /api/v1/shop/signup
module.exports.signUp = async (req, res) => {
    res.status(200).json(await AccessService.signUp(req.body));

    // bỏ try catch
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