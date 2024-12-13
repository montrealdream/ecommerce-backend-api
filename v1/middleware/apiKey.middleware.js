
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const ApiKeyService = require('../services/apiKey.service');

module.exports.requiredApiKey = async (req, res, next) => {
    try {
        // const apiKeyLog = await ApiKeyService.createApiKey(64, ['0000']);

        // lấy api key từ headers
        const apiKey = req.headers[HEADER.API_KEY]?.toString();

        if(!apiKey) {
            return res.status(403).json({
                message: 'Forbidden Error [LỖI]'
            });
        }

        // kiểm tra api key
        const objectKey = await ApiKeyService.findApiKey(apiKey);

        if(!objectKey) {
            return res.status(403).json({
                code: 403,
                message: 'Forbidden Error'
            });
        }

        // gán vào req để check permissions
        req.objectApiKey = objectKey;
        next();
    } 
    catch (error) {
        
    }
}

module.exports.requiredPermission = ( permission ) => {
    return (req, res, next) => {
        if(!req.objectApiKey.permissions) {
            return res.status(403).json({
                code: 403,
                message: 'permisisons denined'
            });
        }

        const isValidPermissions = req.objectApiKey.permissions.includes(permission);
        if(!isValidPermissions) {
            return res.status(403).json({
                code: 403,
                message: 'permisisons denined'
            });
        }   

        return next();
    }
}