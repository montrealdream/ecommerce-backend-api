const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Khai báo Schema
var discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description:  { type: String, required: true },

    // fixed_amount là giảm giá tiền cố định => 10.000
    // percentage là giảm giá theo % => 10%
    discount_type: { type: String, default: 'fixed_amount'},
    discount_value: { type: Number, required: true }, 
    discount_code: { type: String, required: true }, // mã giảm giá

    // ####### TIME #########
    discount_startAt: { type: Date, required: true }, // ngày bắt đầu
    discount_endAt:   { type: Date, required: true }, // ngày kết thúc
    // ####### END TIME #########

    // ####### USER #########
    discount_user_count: { Type: Number, required: true }, // số lượng discount đã sử dụng
    discount_user_used: { Type: Array, default: [] }, // lưu người đã sử dụng
    discount_max_use_per_user: { Type: Number, required: true }, // số lượng cho phép tối đa cho 1 user
    // ####### END USER #########

    discount_max_use: { Type: Number, required: true }, // số lượng discount được áp dụng
    discount_min_order_value: { Type: Number, required: true }, // giá trị đơn hàng tối thiểu
    discount_shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
    discount_isActive: { type: Boolean, default: true }, // trạng thái
    discount_applies_to: { Type: String, required: true, enum: ['all', 'specific'] }, // ứng cho sản phẩm loại nào
    
    discount_list_productId: { Type: Array, default: [] }, // số sản phẩm được áp dụng
}, {
    timestamps: true
});

// Khi tạo sản phẩm thì nên insert vào đây => insert số lượng
//Export model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema, COLLECTION_NAME);