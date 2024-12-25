const mongoose = require('mongoose');

const DOCUMENT_NAME_PRODUCT = 'Product';
const COLLECTION_NAME_PRODUCT = 'products';

const DOCUMENT_NAME_CLOTHING = 'Clothing';
const COLLECTION_NAME_CLOTHING = 'clothings';

const DOCUMENT_NAME_ELECTRONIC = 'Eletronic';
const COLLECTION_NAME_ELECTRONIC = 'electronics';

// Schema chung của sản phẩm
const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: { type: String },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },

        // thuộc tính của sản phẩm ví dụ quần áo thì thuộc tính khác, đồ điện tử thì thuộc tính khác
        product_attributes: { 
            type: mongoose.Schema.Types.Mixed, // hỗn hợp loại gì cũng được
            required: true
        },

        // loại của sản phẩm
        product_type: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing']
        },

        // sản phẩm của Shop (Tài khoản)
        product_shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops'
        }
    }
);

// Sản phẩm type Clothing (quần áo) => product_attributes
const clothingSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true }, // thương hiệu
        size:  String,    // kích cỡ của quần áo
        material: String, // chất liệu của quần áo

        // sản phẩm của Shop (Tài khoản)
        product_shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops'
        }
    },
    {
        timestamps: true
    }
 );

 
// Sản phẩm type Electronics (đồ điện) => product_attributes
const electronicSchema = new mongoose.Schema(
    {
        manufacturer: { type: String, required: true }, // nhà máy sản xuất
        model:  String,  
        color: String,
        
        // sản phẩm của Shop (Tài khoản)
        product_shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops'
        }
    },
    {
        timestamps: true
    }
);

// // Sản phẩm type Furnitrue (nội thất) => product_attributes
// const furnitureSchema = new mongoose.Schema(
//     {
//         manufacturer: { type: String, required: true }, // nhà máy sản xuất
//         model:  String,  
//         color: String,
        
//         // sản phẩm của Shop (Tài khoản)
//         product_shop: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'shops'
//         }
//     },
//     {
//         timestamps: true
//     }
// );

//Export the model
module.exports = {
    Product: mongoose.model(DOCUMENT_NAME_PRODUCT, productSchema, COLLECTION_NAME_PRODUCT),
    Clothing: mongoose.model(DOCUMENT_NAME_CLOTHING, clothingSchema, COLLECTION_NAME_CLOTHING),
    Electronic: mongoose.model(DOCUMENT_NAME_ELECTRONIC, electronicSchema, COLLECTION_NAME_ELECTRONIC),
}