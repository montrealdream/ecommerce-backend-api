// require model
const KeyStoreModel = require('../models/keyToken.model');

// service
class KeyStoreService {
    static createKeyToken = async ({userId, publicKey}) => {
        try {
            // chuyển từ dạng buffer sang string
            const publicKeyString = publicKey.toString('hex');

            console.log(`publicKeyString::${publicKeyString}`); // log

            // lưu userId và publicKey
            const tokens = await KeyStoreModel.create({ userId, publicKey: publicKeyString });
                
            return (tokens ? publicKeyString : null);
        }
        catch (error) {
            return {
                code: 404,
                messsage: error.messsage,
                status: 'error'
            }
        }
    }
}

// export
module.exports = KeyStoreService;