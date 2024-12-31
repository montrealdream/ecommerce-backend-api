const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

// Khai báo Schema
var cartSchema = new mongoose.Schema({
    // trạng thái của giỏ hàng
    cart_status: { type: String, required: true, enum: ['active', 'completed', 'failed', 'pending' ], default: 'active' },
    cart_products: { type: Array, default: [], required: true }, // giỏ hàng
    /**
        cart_products: [
            {
                productId   - ID của sản phẩm
                shopId      - ID của shop chứa sản phẩm
                quantity    - số lượng
                name        - Tên của sản phẩm (Không quan trọng => vì dù sao vẫn phải check lại)
                price       - Giá của sản phẩm (Không quan trọng => vì dù sao vẫn phải check lại)

            }
        ]
     */
    cart_count_products: { type: Number, default: 0 }, // số lượng sản phẩm trong giỏ hàng => vậy để query cho nhanh
    // đương nhiên vẫn có thể dùng cart_products.length => nhưng không nên

    // cart_userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // lưu ý 1 user có 2 vai trò bán / mua
    cart_userId: { type: Number, required: true }, // lưu ý 1 user có 2 vai trò bán / mua


}, {
    timestamps: {
        createdAt: 'createdOn', // chỉnh lại tên biến lưu trong DB
        updatedAt: 'modifiedOn',
    }
});

// Khi tạo sản phẩm thì nên insert vào đây => insert số lượng
//Export model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema, COLLECTION_NAME);