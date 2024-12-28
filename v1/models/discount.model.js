const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Khai báo Schema
const discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description:  { type: String, required: true },

    // fixed_amount là giảm giá tiền cố định => 10.000
    // percentage là giảm giá theo % => 10%
    discount_type: { type: String, default: 'fixed_amount'},
    discount_value: { type: Number, required: true },  // giá trị 10% (percentage) hay 100.000 gì đó theo fixed_amount
    
    discount_code: { type: String, required: true }, // mã giảm giá

    // ####### TIME #########
    discount_startAt: { type: Date, required: true }, // ngày bắt đầu
    discount_endAt:   { type: Date, required: true }, // ngày kết thúc
    // ####### END TIME #########

    // ####### USER #########
    discount_user_count: { type: Number, required: true }, // mỗi user được sử dụng tối đa bao nhiêu

    discount_user_used: { type: Array, default: [] }, // lưu người đã sử dụng
    discount_max_use_per_user: { type: Number, required: true }, // số lượng cho phép tối đa cho 1 user
    // ####### END USER #########

    discount_max_use: { type: Number, required: true }, // số lượng discount được áp dụng
    discount_min_order_value: { type: Number, required: true }, // giá trị đơn hàng tối thiểu
    discount_shopId: { type: mongoose.Types.ObjectId, ref: 'Shop'},
    discount_isActive: { type: Boolean, default: true }, // trạng thái
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] }, // ứng cho sản phẩm loại nào
    
    discount_list_productId: { type: Array, default: [] }, // số sản phẩm được áp dụng

    // không nên lưu vết xóa như thế này
    // dữ liệu xóa khi nào kiện tụng gì đó thì mới lôi ra => nên đưa vào 1 schema khác
    // discount_isDelete: { type: Boolean, default: false},

}, {
    timestamps: true
});

// Khi tạo sản phẩm thì nên insert vào đây => insert số lượng
//Export model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema, COLLECTION_NAME);