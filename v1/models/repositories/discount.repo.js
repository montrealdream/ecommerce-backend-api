// model
const Discount = require('../discount.model');

// util
const indexUtil = require('../../utils/index.utils');


module.exports.findAllDiscountSelect = async ( {
    limit = 50, page = 1, sort = 'ctime', filter, select, model
} ) => {
    const skip = (page - 1) * limit;    
    const sortBy = ( sort === 'ctime' ? {_id: -1} : {_id: 1} );
    const products = await model.find( filter )
                                  .sort(sortBy)
                                  .skip(skip)
                                  .limit(limit)
                                  .select(indexUtil.getSelectData(select)) // select (mongoose) phải là 1 object
                                   //   Query.prototype.select() nhận đối số là «Object|String|Array[String]» không nhất thiết là 1 object
                                  .lean()
    return products;
}

module.exports.findAllDiscountUnSelect = async ( {
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
} ) => {
    const skip = (page - 1) * limit;    
    const sortBy = ( sort === 'ctime' ? {_id: -1} : {_id: 1} );
    const products = await model.find( filter )
                                  .sort(sortBy)
                                  .skip(skip)
                                  .limit(limit)
                                  .select(indexUtil.unGetSelectData(unSelect)) // select (mongoose) phải là 1 object
                                   //   Query.prototype.select() nhận đối số là «Object|String|Array[String]» không nhất thiết là 1 object
                                  .lean()
    return products;
}


module.exports.checkDiscountExits = async ({ model, filter, lean = true}) => {
    const foundDiscount = await model.findOne(filter).lean();

    return foundDiscount;
}