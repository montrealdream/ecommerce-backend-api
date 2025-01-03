/** LIỆT KÊ CÁC SERVICE CHO DISCOUNT
 
    +   Tạo Discount Code [ SHOP | ADMIN ] 
        => SHOP là tài khoản tự tạo discount
        => ADMIN là người quản lý nền tảng ecommerce này tạo ra
        
    +   Get Discount Amount [ USER ]

    +   Get All Discount Code   [ USER | SHOP ]

    +   Verify Discount Code    [ USER ]

    +   Delete Discount Code [ SHOP | ADMIN ]

    +   Cancle Discount Code [ USER ]
 */

// core response 
const { BadRequestError, NotFoundError } = require('../core/error.response'); 

// model
const Discount = require('../models/discount.model');

// utils
const indexUtil = require('../utils/index.utils');

// repo
const ProductRepo = require('../models/repositories/product.repo');
const DiscountRepo = require('../models/repositories/discount.repo');

class DiscountService {
    // Tạo discount mới
    static createDiscountCode = async ( payload ) => {
        // discount không nên random làm gì
        const { 
            discount_code,              // mã 
            discount_startAt,           // ngày bắt đầu
            discount_endAt,             // ngày kết thúc
            discount_isActive,          // trạng thái 
            discount_user_used,         // mảng chứa userId đã sử dụng
            discount_shopId,            // 

            discount_min_order_value,   // giá trị đơn hàng nhỏ nhất để sử dụng mã
            discount_list_productId,    // danh sách productId đã sử dụng
            discount_applies_to,        // áp dụng cho tất cả mặt hàng hay là những mặc hàng đặc biệt

            // 
            discount_name,              // tên của mã giảm giá
            discount_description,       // mô tả vì sao giảm giá
            discount_type,              // loại 'fixed_amount' hay là 'percentage'
            discount_value,             // giảm => ví dụ 'fixed_amout' là 100.000 hoặc 'percentage' là 10 (tức 10%)
            discount_max_value,         // chưa biết ?
            discount_max_use,           // số lần tối đa áp dụng mã Discount này
            
            discount_user_count,        // mỗi user được sử dụng tối đa bao nhiêu
            discount_max_use_per_user,  // một người được sử dụng bao nhiêu lần
        } = payload 

        // kiểm tra thời gian hợp lệ
        // thời gian bắt đầu phải LỚN HƠN thời gian hiện tại => vì tạo cho tương lai chứ ko phải tạo cho quá khứ
        // if(new Date () < new Date(discount_startAt) ||new Date() > new Date(discount_endAt)) {
        //     throw new BadRequestError('Thời gian không hợp lệ');
        // }

        // nếu thời gian bắt đầu >= thời gian kết thúc
        if(new Date(discount_startAt) >= new Date(discount_endAt)) {
            throw new BadRequestError('Thời gian bắt đầu phải >= thời gian kết thúc');
        }

        // check xem discount này tồn tại chưa hén  => vì dùng nhiều lần nên có thể viết dô repo
        const filterDiscount = {
            discount_code,
            discount_shopId: indexUtil.convertToObjectIdMongoDb(discount_shopId),
        }

        const foundDiscount = await DiscountRepo.checkDiscountExits({model: Discount, filter: filterDiscount});

        // Nếu cái discount này đnag hoạt động
        if(foundDiscount && foundDiscount.discount_isActive == true) {
            throw new BadRequestError('Discount exits !!!');
        }

        // tạo mới discount
        const newDiscount = await Discount.create({
            discount_code,  // mã 
            discount_startAt,   // ngày bắt đầu
            discount_endAt,     // ngày kết thúc
            discount_isActive,  // trạng thái 
            discount_shopId,    // 
            discount_min_order_value,   // giá trị đơn hàng nhỏ nhất để sử dụng mã
            discount_list_productId,    // danh sách productId đã sử dụng
            discount_applies_to,        // áp dụng cho tất cả mặt hàng hay là những mặc hàng đặc biệt

            // 
            discount_name,              // tên của mã giảm giá
            discount_description,       // mô tả vì sao giảm giá
            discount_type,              // loại 'fixed_amount' hay là 'percentage'
            discount_value,             // giảm => ví dụ 'fixed_amout' là 100.000 hoặc 'percentage' là 10 (tức 10%)
            discount_max_use,           // số lượng discount được áp dụng
            discount_user_used,         // số lượng đã sử dụng
            discount_max_use_per_user,  // một người được sử dụng bao nhiêu lần
            discount_user_count
        });
        
        return newDiscount;
    }

    // // Update discount
    // static updateDiscountCode = async ( ) => {

    // }

    // /**
    //  * lấy discount có sẵn với sản phẩm
    // */
    // // [DÀNH CHO USER]
    static getAllDiscountCodeWithProduct = async ({
        discount_code,
        discount_shopId,
        // userId =" ", // có đôi lúc shop cho phép người dùng chưa có userId xem được, cái này tùy thuộc nha
        limit, 
        page
    }) => {

        // check xem discount này tồn tại chưa hén  => vì dùng nhiều lần nên có thể viết dô repo
        const filterDiscount = {
            discount_code,
            discount_shopId: indexUtil.convertToObjectIdMongoDb(discount_shopId),
        }

        const foundDiscount = await DiscountRepo.checkDiscountExits({
            model: Discount, 
            filter: filterDiscount
        });

        // nếu discount không tồn tại hoặc đã ngừng hoạt động
        if(!foundDiscount || !foundDiscount.discount_isActive) {
            throw new NotFoundError('Discount không tồn tại !!!');
        }

        // NẾU: discount_applies_to === 'all' => thì lấy hết sản phẩm
        const { discount_applies_to,  discount_list_productId } = foundDiscount;

        let products = {};

        if(discount_applies_to === 'all') {
            // lấy hết sản phẩm
            products = await ProductRepo.findAllProduct({
                filter: { 
                    product_shop: indexUtil.convertToObjectIdMongoDb(discount_shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'specific') {
            // lấy sản phẩm theo list productId
            products = await ProductRepo.findAllProduct({
                filter: { 
                    _id: { $in: discount_list_productId},
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products;
    }

    // /**
    //  * lấy discount của shop
    // */

    static getAllDiscountByShop = async ({ limit, page, shopId }) => {

        // filter
        const filter = {
            discount_shopId: indexUtil.convertToObjectIdMongoDb(shopId),
            discount_isActive: true
        }
        
        // unSelect
        const unSelect = ['__v', 'discount_shopId'];

        const discounts = await DiscountRepo.findAllDiscountUnSelect({ limit: +limit, page: +page, filter, unSelect,
            model: Discount
        });

        return discounts;
    }

    // // Apply Discount Code => Check Discount Này Phù Hợp với sản phẩm ko
    // /**
    //   products = [
    //     {
    //         productId: 
    //         shopId:
    //         quantity:
    //         name:
    //         price:
    //     }
    //   ]
    // */
    static getDiscountAmout = async ({ codeId, userId, shopId, products }) => {

        // check xem discount này có tồn tại không nè
        const filterDiscount = {
            discount_code: codeId,
            discount_shopId: indexUtil.convertToObjectIdMongoDb(shopId),
        }

        const foundDiscount = await DiscountRepo.checkDiscountExits({model: Discount, filter: filterDiscount});

        if(!foundDiscount) throw new NotFoundError('Không tìm thấy discount Code ');

        const { 
            discount_isActive,
            discount_max_use,
            discount_startAt,
            discount_endAt,
            discount_max_use_per_user,
            discount_user_used,
            discount_type,
            discount_value,
            discount_min_order_value
        } = foundDiscount;

        // check xem discount này còn hoạt động không
        if(!discount_isActive) throw new NotFoundError('discount này hết hạn');

        // check xem còn số lượng sử dụng không
        if(!discount_max_use) throw new NotFoundError(' discount này hết lượt sử dụng gòi ');

        // // check xem còn hạn sử dụng không
        // if(new Date() < new Date(discount_startAt) || new Date() > new Date(discount_endAt))
        //     throw new NotFoundError('discount này thời gian không hợp lý');

        // check xem có set giá tối thiểu không
        let totalOrder = 0;
        if(discount_min_order_value > 0) {
            // get total của products (giỏ hàng á)
            totalOrder = products.reduce((total, current, index) => {
                return total += (current.quantity * current.price)
            } ,0);

            // nếu giá trị đơn giản chưa đủ với điều kiện của Discount
            if(totalOrder < discount_min_order_value) {
                throw new NotFoundError('giá trị đơn hàng này chưa đủ nè');
            }
        }

        // check số lần userId này đã sử dụng (nếu mỗi ng chỉ có 1 lần sài thì seo)
        if(discount_max_use_per_user > 0 ) {
            const userUsedDiscount = discount_user_used.find(user => user.userId === userId);

            // nếu user này đã sử dụng
            
        }

        // check xem discount này là 'fixed_amount' hay 'percentage'
        let amount;
        if(discount_type === 'fixed_amount') amount = discount_value;
        else if(discount_type === 'percentage') amount = totalOrder * (discount_value / 100);
        
        // discount_applies_to filed này chính là xác nhận coupon này có áp dụng cho hết toàn một sản phẩm hay từng sản phẩm.
        
        return {
            totalOrder,
            discount: amount, // discount được giảm giá bao nhiêu (đã được tính)
            totalPrice: totalOrder - amount // tổng tiền
        }
            
    }

    // /**
    //  * Delete 
    // */
    // static deleteDiscount = async ( { shopId, codeId } ) => {
    //     // có thể dùng findOneAnDelete => xóa này đơn giản vl

    //     // cách khác
    //     // [1]  Tìm (truy vấn CSDL)
    //     // [2]  Tìm thấy => xóa
    //     // cách này thì sẽ bổ sung vài cái khác biệt như là:
    //     // +    có đang sử dụng cho giỏ hàng nào hay không
    //     // +    người dùng có đang ... 
    // }

    // // Cancle (Dành cho user) => Tức là user ko sài nữa á
    // static cancleDiscountCode = async ({ codeId, shopId, userId }) => {
    //     // check có tồn tại không
    //     const filterDiscount = {
    //         discount_code: codeId,
    //         discount_shopId: indexUtil.convertToObjectIdMongoDb(shopId),
    //     }

    //     const foundDiscount = await DiscountRepo.checkDiscountExits({model: Discount, filter: filterDiscount});

    //     if(!foundDiscount) throw new NotFoundError('Không tìm thấy discount code');
        
    //     // update
    //     const result = await Discount.findByIdAndUpdate(
    //         foundDiscount._id, 
    //         {
    //             $pull: { discount_user_used: userId }, // lấy userId này khỏi mảng danh sách user sẽ (chuẩn bị) sử dụng
    //             // ... bỏ dòng cho dễ nhìn tí thui
    //             $inc : {
    //                 // increase
    //                 discount_max_use: 1, // trả lại là 1
    //                 discount_user_count: -1,
    //             }
    //         }
    //     )

    //     return result;
    // }
}

module.exports = DiscountService