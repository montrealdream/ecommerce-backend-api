// require model
const ShopModel = require('../models/shop.model');

// require package
const bcrypt  = require('bcryptjs');
const salt = bcrypt .genSaltSync(10);
const crypto = require('crypto');

// require service
const KeyStoreService = require('./keyToken.service');
const ShopService = require('./shop.service');

// require utils
const authUtils = require('../utils/auth.utils');
const { getInfoData } = require('../utils/index.utils');
const generateUtil = require('../utils/generate');

// require response core
const { BadRequestError, ConflictRequestError, UnAuthorizedRequestError, } = require('../core/error.response');

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
        // Bước 1: Check email đã tồn tại
        // lean() trả về Object JS thuần túy
        const emailExits = await ShopModel.findOne({email}).lean();
        if(emailExits) {
            console.log(`[1]::Throw BadRequestError`);
            throw new BadRequestError(`Error: Email đã tồn tại`);
            // return {
            //     code: 'xxx', // trong docs
            //     message: 'Email đã tồn tại'
            // }
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
            // const privateKey = crypto.randomBytes(64).toString('hex');
            // const publicKey  = crypto.randomBytes(64).toString('hex');

            // Tạo Private Key và Public Key dùng thuật toán bất đối xứng
            // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', { 
            //     modulusLength : 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // });

            // Tạo PublicKey và PrivateKey đã chuyển về dạng string
            const { privateKey, publicKey } = generateUtil.keyPairSync();

            // Tạo AccessToken và RefreshToken
            const payload = { userId: newShop._id, email };
            const { accessToken, refreshToken } = await authUtils.createPairToken(payload, publicKey, privateKey);

            // Lưu Public Key vào Db => Trả về Public Key Dạng String - Cách cũ 
            // const publicKeyString = await KeyStoreService.createKeyToken({
            //     userId: newShop._id,
            //     publicKey
            // });

            // Lưu Public Key, Private Key, Refresh Token  vào Db
            const tokenDocs = await KeyStoreService.createKeyToken({ userId: newShop._id, publicKey, privateKey, refreshToken });

            // if(!publicKeyString) return { code: 'xxx', message: 'Public Key Error'};

            if(!tokenDocs) throw new BadRequestError("SignUp::Public Key Error");
            // // Tạo Access Token và Refresh Token
            // const payload = {userId: newShop._id, email: newShop.email};
            // const tokens = await authUtils.createPairToken(payload, publicKeyString, privateKey);

            return {
                shop: getInfoData(newShop, ['_id', 'name', 'email']),
                tokens: { accessToken, refreshToken }
            }
        }

        // Nếu Tạo Thất Bại
        return { code: 200, metadata: null };
    }

    static login = async ({email, password}) => {
        // Bước 1 : Kiểm tra email
        const foundShop = await ShopService.findByEmail({email});

        if(!foundShop) throw new BadRequestError('Shop chưa được đăng ký');

        // Bước 2: Kiểm tra mật khẩu
        const isPassword = bcrypt.compareSync(password, foundShop.password);
        if(!isPassword) throw new UnAuthorizedRequestError('Shop Authencation Error');

        // Tạo Access Token và Refresh Token
        if(foundShop && isPassword) {

            // Tạo Public Key và Private Key đã được chuyển về dạng String
            const { privateKey, publicKey } = generateUtil.keyPairSync();

            // Tạo AccessToken và RefreshToken
            const payload = { userId: foundShop._id, email };
            const { accessToken, refreshToken } = await authUtils.createPairToken(payload, publicKey, privateKey);
            
            // Lưu Public Key, Private Key, Refresh Token  vào Db
            const tokenDocs = await KeyStoreService.createKeyToken({ userId: foundShop._id, publicKey, privateKey, refreshToken });
                
            if(!tokenDocs) throw new BadRequestError("Login::Public Key Error");

            return {
                shop: getInfoData(foundShop, ['_id', 'name', 'email']),
                tokens: { accessToken, refreshToken }
            }
        }
        
    }
}

// export
module.exports = AccessService
