// require model
const ShopModel = require('../models/shop.model');

class ShopService {
    static findByEmail = async ({email, select = {
        email: 1, password: 1, status: 1, roles: 1
    }}) => {
        console.log(select);
        return await ShopModel.findOne({email}).select(select).lean();
    }
}

module.exports = ShopService;