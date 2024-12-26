// model
const { Product } = require('../product.model');

module.exports.findAllDraftForShop = async ({query, limit, skip}) => {
    return await Product.find(query)
                        .populate('product_shop', 'name email -_id') // populate sẽ vào db ref mà lấy ra thông tin 
                        .sort({ updateAt: -1 }) // lấy thằng mới nhứt
                        .skip(skip) 
                        .limit(limit)
                        .lean()
                        // .exec() // có hay không cũng được => đại diện cho Promise trong mongoose
}