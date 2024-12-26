// model
const { BadRequestError } = require('../../core/error.response');
const { Product } = require('../product.model');

// mongoose 
const { Types } = require('mongoose');

// Query: Lấy toàn bộ bản nháp
module.exports.findAllDraftForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip});
}

// Query: Lấy toàn bộ bản đã publish (isPublished: true)
module.exports.findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip});
}


const queryProduct = async ({ query, limit, skip }) => {
    return await Product.find(query)
                        .populate('product_shop', 'name email -_id') // populate sẽ vào db ref mà lấy ra thông tin 
                        .sort({ updateAt: -1 }) // lấy thằng mới nhứt
                        .skip(skip) 
                        .limit(limit)
                        .lean()
                        // .exec() // có hay không cũng được => đại diện cho Promise trong mongoose
}

// Post: Publish một bản draft (nháp)
module.exports.publishProductByShop = async ({ product_id, product_shop }) => {
    // tìm sản phẩm cần Publish
    const foundProduct = await Product.findOne({
        // _id: Types.ObjectId(product_id),
        _id: product_id,
        product_shop,
        // isPublished: false
    });

    // if(!foundProduct) throw new BadRequestError('Không tìm thấy sản phẩm');


    foundProduct.isDraft = false;
    foundProduct.isPublished = true;

    // nếu có bản ghi update nó sẽ trả về 1
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}