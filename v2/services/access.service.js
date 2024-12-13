// require model
const ShopModel = require('../models/shop.model');

// require package
const bcrypt  = require('bcryptjs');
const salt = bcrypt .genSaltSync(10);
const crypto = require('crypto');

// require service
const KeyStoreService = require('./keyToken.service');

// require utils
const authUtils = require('../utils/auth.utils');
const { getInfoData } = require('../utils/index.utils');

// các quyền của shop
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITE',
    EDITOR: 'EDIT',
    ADMIN:  'ADMIN'
}

// service
class AccessService {

    static signUp = async ({name, email, password}) => {
        try {
            // Bước 1: Check email đã tồn tại
            // lean() trả về Object JS thuần túy
            const emailExits = await ShopModel.findOne({email}).lean();
            if(emailExits) {
                return {
                    code: 'xxx', // trong docs
                    message: 'Email đã tồn tại'
                }
            } 

            // Bước 2: Băm mật khẩu
            const passwordHashed = bcrypt.hashSync(password, salt);

            // Bước 3 : Tạo mới 
            const newShop = await ShopModel.create({
                name,
                email,
                password: passwordHashed,
                roles: [RoleShop.SHOP] // Gán role
            });

            // Nếu Tạo Shop Thành Công
            if(newShop) {   
                // Tạo Private Key (Đưa người dùng) và Public Key (Lưu vào database)
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey  = crypto.randomBytes(64).toString('hex');

                // Lưu Public Key và Private Key vào Db
                const keyStore = await KeyStoreService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if(!keyStore) return { code: 'xxx', message: 'Public Key Error'};

                // Tạo Access Token và Refresh Token
                const payload = {userId: newShop._id, email: newShop.email};
                const tokens = await authUtils.createPairToken(payload, publicKey, privateKey);

                return {
                    code: 201,
                    shop: getInfoData(newShop, ['_id', 'name', 'email']),
                    tokens
                }
            }

            // Nếu Tạo Thất Bại
            return { code: 200, metadata: null };
        }
        catch (error) {
            return {
                code: 404,
                message: error.message,
                status: 'error'
            }
        } 
    }
}

// export
module.exports = AccessService
