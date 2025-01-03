// model
const { BadRequestError } = require('../../core/error.response');
const { Product } = require('../product.model');

// utils
const indexUtil = require('../../utils/index.utils');

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

// Query: Tìm kiếm sản phẩm
module.exports.searchProduct = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await Product.find(
        {
            isDraft: true,
            $text: { $search: regexSearch}
        },
        { 
            score: { $meta: 'textScore' } 
        }
    )
    .sort({ score: { $meta: 'textScore' }  })
    .lean()
    return result;
}

// Query: Tìm kiếm toàn bộ sản phẩm
module.exports.findAllProduct = async ({ limit , sort , page , filter, select }) => {
    const skip = (page - 1) * limit;    
    const sortBy = ( sort === 'ctime' ? {_id: -1} : {_id: 1} );
    const products = await Product.find( filter )
                                  .sort(sortBy)
                                  .skip(skip)
                                  .limit(limit)
                                  .select(indexUtil.getSelectData(select)) // select (mongoose) phải là 1 object
                                   //   Query.prototype.select() nhận đối số là «Object|String|Array[String]» không nhất thiết là 1 object
                                  .lean()
    return products;
}

module.exports.findProduct = async ({ product_id, unSelect }) => {
    return await Product.findById( product_id )
                        .select(indexUtil.unGetSelectData(unSelect)) // select (mongoose) phải là 1 object
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

    if(!foundProduct) throw new BadRequestError('Không tìm thấy sản phẩm');


    foundProduct.isDraft = false;
    foundProduct.isPublished = true;

    // nếu có bản ghi update nó sẽ trả về 1
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

// Post: UnPublish một product 
module.exports.unPublishProductByShop = async ({ product_id, product_shop }) => {
    // tìm sản phẩm cần Publish
    const foundProduct = await Product.findOne({
        // _id: Types.ObjectId(product_id),
        _id: product_id,
        product_shop,
        // isPublished: false
    });

    if(!foundProduct) throw new BadRequestError('Không tìm thấy sản phẩm');


    foundProduct.isDraft = true;
    foundProduct.isPublished = false;

    // nếu có bản ghi update nó sẽ trả về 1
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

// Update Sản phẩm
// model vì nó có thể là Product, Clothing hoặc là Electronic
// isNew
module.exports.updateProductById = async ({ 
    productId, 
    payloadUpdate, 
    model, 
    isNew = true
}) => {
    return await model.findByIdAndUpdate(
        productId, 
        payloadUpdate, 
        {
            new: isNew
        }
    )
} 

// lấy sản phẩm theo id
module.exports.getProductById = async ({ productId }) => {
    return await Product.findOne({_id: indexUtil.convertToObjectIdMongoDb(productId)}).lean();
}

// kiểm tra xem sản phẩm trên server có hợp lệ hem 
module.exports.checkProductByServer = async ({ products }) => {
    // console.log('request before promise all::', request);

    return await Promise.all( products.map(async product => {
        const foundProduct = await this.getProductById({ productId: product.productId})

            if(foundProduct) return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId,
            }
        })
    )
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

