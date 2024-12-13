// require package
const JWT = require('jsonwebtoken');


// tạo accessToken và refreshToken
module.exports.createPairToken = async (payload, publicKey, privateKey) => {
    try {
        // Tạo Access Token
        const accessToken = await JWT.sign(payload, privateKey, { 
            expiresIn: '2 days'
        });

        // Tạo Refresh Token
        const refreshToken = await JWT.sign(payload, privateKey, { 
            expiresIn: '7 days'
        });

        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
        return {
            code: 404,
            messsage: error.messsage,
            status: 'error'
        }
    }
}