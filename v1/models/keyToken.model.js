const mongoose = require('mongoose');

const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'key-stores';

// Khai báo Schema
var keyStoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: { type: String, required: true },
    refreshToken: { type: Array, default: [] }
}, {
    timestamps: true
});

//Export model
module.exports = mongoose.model(DOCUMENT_NAME, keyStoreSchema, COLLECTION_NAME);