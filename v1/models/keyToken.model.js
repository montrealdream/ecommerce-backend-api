const mongoose = require('mongoose');

const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'key-stores';

// Khai báo Schema - Cách cũ
// var keyStoreSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'Shop'
//     },
//     publicKey: { type: String, required: true },
//     refreshToken: { type: Array, default: [] }
// }, {
//     timestamps: true
// });

// Khai báo Schema - Cách mới
var keyStoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shop' },

    privateKey: { type: String, required: true },

    publicKey: { type: String, required: true },

    refreshToken: { type: String, required: true }, // refreshToken đang sử dụng

    usedRefreshToken: { type: Array, default: [] }, // refreshToken đã sử dụng
}, {
    timestamps: true
});

//Export model
module.exports = mongoose.model(DOCUMENT_NAME, keyStoreSchema, COLLECTION_NAME);