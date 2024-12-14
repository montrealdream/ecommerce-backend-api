const crypto = require('crypto');

module.exports.keyPairSync = () => {
    // Tạo Private Key và Public Key dùng thuật toán bất đối xứng
    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', { 
        modulusLength : 4096,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    });
    
    const publicKeyString = publicKey.toString('hex');
    const privateKeyString = privateKey.toString('hex');

    return {
        publicKey:  publicKeyString,
        privateKey: privateKeyString
    }
}