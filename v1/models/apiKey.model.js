const mongoose = require('mongoose');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'api-keys';

// Định nghĩa Permissions
const BASIC = '0000';
const PRO = '1111';
const VIP = '2222';

// Khai báo Schema
var apiKeySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true},
    status: { type: Boolean, default: true },
    permissions: { type: [String], required: true, enum: [BASIC, PRO, VIP] }
});

//Export model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema, COLLECTION_NAME);