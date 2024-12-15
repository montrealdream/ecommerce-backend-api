// require response core
const { AuthorizedRequestError, NotFoundError } = require('../core/error.response');
const { } = require('../core/success.response');

// require service 
const KeyStoreService = require('../services/keyToken.service');

// require package
const JWT = require('jsonwebtoken');

// Header HTTP
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization', // chứa access token
    REFRESH_TOKEN: 'x-rtoken-id' 
}

module.exports.authentication = async (req, res, next) => {
    // Bước 1: Kiểm tra UserId
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthorizedRequestError('Invalid Request');

    const keyStore = await KeyStoreService.findByUserId({userId});
    if(!keyStore) throw new NotFoundError('Not Found Key Store')

    // Bước 2: Kiểm tra Access Token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthorizedRequestError('Invalid Request');

    try {
        const publicKey  = keyStore.publicKey;
        const privateKey = keyStore.privateKey;
        // Bước 3: Verify 
        const decodePayload = await JWT.verify(accessToken, publicKey, { algorithm: 'RS256' });
        
        // Bước 4: Kiểm tra lại userId có hợp lệ không với userId của KeyStore
        if(userId !== decodePayload.userId) throw AuthorizedRequestError('Invalid Request');

        // Bước 5 gán KeyStore
        req.keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw error;
    }

}