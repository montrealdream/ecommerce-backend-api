// require package
const JWT = require('jsonwebtoken');


// tạo accessToken và refreshToken
module.exports.createPairToken = async (payload, publicKey, privateKey) => {
    try {
        // Tạo Access Token
        const accessToken = await JWT.sign(payload, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        // Tạo Refresh Token
        const refreshToken = await JWT.sign(payload, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        // Verify
        const payloadVerify = await JWT.verify(accessToken, publicKey);
        console.log('JWT verify::', payloadVerify);

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

// verify 
module.exports.verifyToken = async ( { token, keySecret } ) => {
    const { userId, email } = await JWT.verify( token, keySecret);

    return { userId, email };
}