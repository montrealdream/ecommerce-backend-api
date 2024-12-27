const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories';

// Khai báo Schema
var inventorySchema = new mongoose.Schema({
    inventory_productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, // id của sản phẩm
    inventory_location:  { type: String, default: 'unknow' }, // địa chỉ
    inventory_stock: { type: Number, required: true}, // số lượng hàng tồn kho
    inventory_shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop'}, // id của shop (account)

    inventory_reservations: { type: Array, default: [] }, // đặt trước => khi người ta add product vào giỏ hàng => add vào đây

    /**
     * reservation => cái này giúp ngăn ngừa lỗi hàng tồn kho => đảm bảo khách hàng nhận được
     *      => cartId
     *      => stock số lượng
     *      => createOn thời gian tạo
     */
}, {
    timestamps: true
});

// Khi tạo sản phẩm thì nên insert vào đây => insert số lượng
//Export model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema, COLLECTION_NAME);