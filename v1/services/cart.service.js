/**
 * thêm sản phẩm vào giỏ hàng [ user ]
 * giảm số lượng sản phẩm 1 lần [ user ]
 * tăng _______________________ [ user ]
 * lấy (hiển thị) giỏ hàng
 * xóa toàn bộ giỏ hàng
 * xóa item trong giỏ hàng
*/

// model
const CartModel = require('../models/cart.model');

// repo
const ProductRepo = require('../models/repositories/product.repo');

// core response 
const { BadRequestError, NotFoundError } = require('../core/error.response'); 

// utils
const indexUtil = require('../utils/index.utils');

// repo
const CartRepo = require('../models/repositories/cart.repo');

// service
class CartService {

    // thêm sản phẩm vào giỏ hàng
    static addToCart = async ({ userId, product = {}}) => {
        // check cart này có tồn tại không
        const userCart = await CartModel.findOne({ cart_userId: userId });

        // nếu chưa tồn tại GIỎ HÀNG => tạo giỏ hàng mới và add sản phẩm vào thôi thui
        if(!userCart)  return await CartRepo.createNewUserCart({userId, product});

        // nếu GIỎ HÀNG đã tồn tại NHƯNG rỗng
        if(!userCart.cart_count_products) {
            userCart.cart_products = [ product ]; // thêm dô GIỎ HÀNG THUI
            return await userCart.save();
        }

        // nếu ĐÃ CÓ SẢN PHẨM trong GIỎ HÀNG rồi => tăng số lượng
        return await CartRepo.updateQuantityItemInCart({ userId, product });
    }

    // thêm sản phẩm vào giỏ hàng version 2 => + - update
    /**
        userId,
        shop_order_ids: [
            {
                shopId
                item_products : [
                    {
                        shopId
                        quantity - số lượng
                        price - giá tiền
                        old_quantity - lưu số lượng sau khi mình giảm hoặc tăng
                        productId - id của sản phẩm

                    }
                ]
                version - khóa lạc quan - khóa bi quan
            }
        ]
    */
    static addToCartV2 = async({userId, shop_order_ids }) => {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]; 

        // console.log('shop_order_ids:::', productId)
        // kiểm tra sản phẩm này có tồn tại không
        const foundProduct = await ProductRepo.getProductById({ productId });
        if(!foundProduct) throw new NotFoundError('Không tìm thấy sản phẩm');

        // so sánh 
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError('Không khớp cửa hàng');

        if(quantity === 0) {
            // xóa sản phẩm khỏi giỏ hàng
        }

        return await CartRepo.updateQuantityItemInCart({ userId, product: {
            productId,
            quantity: quantity - old_quantity
        }});
    }

    // xóa giỏ hàng
    static deleteUserCart = async ({ userId, productId }) => {
        const filter = { cart_userId: userId, cart_status: 'active' };
        const update = { $pull: { cart_products: { productId } } }; // kéo ra khỏi giỏ hàng
        return await CartModel.updateOne(filter, update);
    }

    // lấy danh sách giỏ hàng
    static getListCart = async ({ userId }) => {
        return await CartModel.findOne({ cart_userId: userId }).lean();
    }
}

module.exports = CartService;