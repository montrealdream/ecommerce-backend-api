// model
const CartModel = require('../cart.model');

// thêm sản phẩm vào giỏ hàng
module.exports.createNewUserCart = async ({ userId, product }) => {
    const filter = { cart_userId: userId, cart_status: 'active' };
    const updateOrInsert = { 
        $addToSet: { cart_products: product },
        cart_count_products: 1
    };
    const option = { upsert: true, new: true };

    // tạo giỏ hàng mới
    const userCart = await CartModel.findOneAndUpdate(filter, updateOrInsert, option);
    return userCart;
}

// tăng, giảm số lượng của item lên
module.exports.updateQuantityItemInCart = async ({ userId, product }) => {
    const { productId, quantity } = product;

    const filter = { 
        cart_userId: userId, 
        'cart_products.productId': productId,
        cart_status: 'active' 
    };
    const update = { $inc: { 'cart_products.$.quantity': quantity } }
    const option = { upsert: true, new: true }

    return await CartModel.findOneAndUpdate(filter, update, option);
}