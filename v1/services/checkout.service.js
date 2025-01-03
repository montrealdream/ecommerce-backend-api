
// repo
const { findCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const {  } = require('../models/repositories/discount.repo');

// response core
const { BadRequestError } = require('../core/error.response');

// service
const DiscountService = require('../services/discount.service');

// service
class CheckoutService {

    /**
        {
            cartId,
            userId,
            shop_order_ids: [
                {   
                    // khi mua ở shop A
                    shopId,
                    shop_discount[] - mã giảm giá của shop này
                    item_products: [
                        productId,
                        price, 
                        quantity
                    ]
                },
                {   
                    // khi mua ở shop B 
                    shopId,
                    shop_discount[ 
                        {
                            "shopId",
                            "codeId", mã code
                            "discountCodeId",
                        }
                    ] - mã giảm giá của shop này
                    item_products: [
                        productId,
                        price, 
                        quantity
                    ]
                }
            ]
        }
    */
    // cái này sẽ review lại
    static checkoutReview = async ({ cartId, userId, shop_order_ids }) => {
        // shop_order_ids nghĩa là nhiều đơn hàng mua từ nhiều shop

        // 1. Kiểm tra xem cartId này có tồn tại không
        const foundCart = await findCartById({cartId});
        if(!foundCart) throw new BadRequestError('Hông Tìm thấy dỏ hàng');
    
        const checkout_order = {
            totalPrice   : 0,     // tổng tiền của đơn hàng
            feeShip      : 0,    // phí vận chuyển
            totalDiscount: 0,    // tổng tiền được giảm giá 
            totalCheckout: 0,    // tổng tiền phải trả (tổng thanh toán)
        };

        let shop_order_ids_new = [];

        // tính đơn hàng mua của từng shop
        for(let index = 0 ; index < shop_order_ids.length ; index ++) {
            const { shopId, shop_discounts, item_products } = shop_order_ids[index];

            // check sản phẩm hợp lệ
            const checkProductServer = await checkProductByServer({ products: item_products });
            
            // giả sử 1 trong những thằng ở mảng trả về nó fail
            if(!checkProductServer[0]) throw new BadRequestError('order wrong');

            // tổng giá trị đơn hàng
            // total tổng tiền
            // current product là sản phẩm đang duyệt
            // index
            const checkoutPrice = checkProductServer.reduce(( total, curProduct, index) => {
                return total + (curProduct.price * curProduct.quantity);
            }, 0);
            

            // tổng tiền trước khi xử lý
            checkout_order.totalPrice += checkoutPrice;

            // tạo 1 item checkout => checkout của 1 shop
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // trước khi giảm giá nha fen
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            console.log('checkoutProductServer:::', checkProductServer)
            // nếu shop_discounts tồn tại > 0, check xem có tồn tại hay không
            if(shop_discounts.length > 0) {
                // giả sử chỉ có 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmout({
                    codeId: shop_discounts[0].codeId, // giả sử có 1 cái code nha
                    userId,
                    shopId,
                    products: checkProductServer
                });


                // ...
                // tổng discount giảm giá
                checkout_order.totalDiscount += discount;
                
                // nếu tiền giảm giá > 0 => tức là có giảm giá
                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount; // số tiền phải trả
                }

                // tổng thanh toán cuối cùng
                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
                
                // push
                shop_order_ids_new.push(itemCheckout)
            }
        } 
        return {
            shop_order_ids, // mảng danh sách shop chứa các đơn hàng ta đặt [1]
            shop_order_ids_new, // mảng danh sách chứa các đơn hàng ta đặt nhưng đã được tính toán [2]

            // từ [1] và [2] => để so sánh
            
            checkout_order // thông tin phải trả tiền
        }
    }
}

// 
module.exports = CheckoutService;