const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';

// Khai báo Schema
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

//Export model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema, COLLECTION_NAME);