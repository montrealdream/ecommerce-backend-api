const crypto = require('crypto');

module.exports.randomString = (length) => {
    return crypto.randomBytes(length).toString('hex');
}