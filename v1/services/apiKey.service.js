// require model
const apiKeyModel = require("../models/apiKey.model")

// require helper
const generateHelper = require('../helpers/generate.helper');

// service
class ApiKeyService {
    static createApiKey = async ( length, permissions = [] ) => {
        try {
            const randomString = generateHelper.randomString(length);
    
            await apiKeyModel.create({
                key: randomString,
                permissions: permissions
            });
    
            return {
                message: 'Tạo thành công API KEY',
                apiKey: randomString
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    static findApiKey = async ( apikey ) => {
        try {
            const objectKey = await apiKeyModel.findOne({
                key: apikey,
                status: true
            }).lean();
            
            console.log(`objectApiKey::`, objectKey);
            return objectKey;
        } 
        catch (error) {
            
        }
    }
}

// export
module.exports = ApiKeyService;