// require model
const KeyStoreModel = require('../models/keyToken.model');

// service
class KeyStoreService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        // Cơ bản
        // try {
        //     // chuyển từ dạng buffer sang string (nếu dùng thuật toán RSA)
        //     const publicKeyString = publicKey.toString('hex');

        //     // lưu userId và publicKey
        //     const tokens = await KeyStoreModel.create({ userId, publicKey: publicKeyString });
                
        //     return (tokens ? publicKeyString : null);
        // }
        // catch (error) {
        //     return {
        //         code: 404,
        //         messsage: error.messsage,
        //         status: 'error'
        //     }
        // }

        // Nâng cao
        try {
            // chuyển từ dạng buffer sang string (nếu dùng thuật toán RSA)
            // const publicKeyString = publicKey.toString('hex');
            // const privateKeyString = privateKey.toString('hex');

            const filter  = {userId};
            const update  = { 
                privateKey,
                publicKey,
                refreshToken,
                usedRefreshToken: []
            };
            const options = { new: true, upsert: true };

            const tokens = await KeyStoreModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens : null;
        }
        catch(error) {
            return error;
        }
    }

    static findByUserId = async ( { userId } ) => {
        const keyStore = await KeyStoreModel.findOne({ userId });
        return keyStore;
    }

    static findByRefreshToken = async ( { refreshToken }) => {
        return await KeyStoreModel.findOne({ refreshToken }).lean();
    }

    static findByRefreshTokenUsed = async ( { refreshToken } ) => {
        console.log('[1]RefreshToken:::' + refreshToken);
        return await  KeyStoreModel.findOne( { usedRefreshToken: refreshToken } );
    }

    static updateRefreshToken = async ( { userId, refreshToken, usedRefreshToken }) => {
        return await KeyStoreModel.updateOne( 
            { userId },
            {
                $set: { refreshToken: refreshToken }, // lưu refreshToken mới
                $addToSet: { usedRefreshToken: usedRefreshToken }
            }
        );
    }

    static removeKeyStoreById = async ( { userId } ) => {
        return await KeyStoreModel.deleteOne({ userId });
    }
}

// export
module.exports = KeyStoreService;