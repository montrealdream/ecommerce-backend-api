// package
const _ = require('lodash');
const { Types } = require('mongoose');

// giúp lấy các filed từ một object
module.exports.getInfoData = (object = {}, field = []) => {
    return _.pick(object, field);
}

// ['a', 'b'] => {'a': 1, 'b': 1}
module.exports.getSelectData = ( select = [] ) => {
    return Object.fromEntries(select.map( item => [item, 1]));
}

// ['a', 'b'] => {'a': 0, 'b': 0} => không lấy thì truyền dô 0 là ngon
module.exports.unGetSelectData = ( select = [] ) => {
    return Object.fromEntries(select.map( item => [item, 0]));
}

// loại bỏ các trường dữ liệu key-value có value === undefined hoặc null
module.exports.removeUndefinedObject = (obj) => {
    // console.log('getObj::',Object.keys(obj));
    Object.keys(obj).forEach( item => {
        // index tức là key
        if(obj[item] === undefined || obj[item] === null) delete obj[item];
    });

    return obj
}

/**
    @description giúp chuyển đổi từ dạng
    a {
        b: 1,
        c: 2
    }

    sang dạng

    'a.b': 1,
    'a.c': 2
 */
module.exports.updateNestedObjParse = ( obj = {} ) => {
    const results = {}; // object chứa kết quả

    Object.keys(obj).forEach( keyOfObj => {
        // kiểm tra xem cái giá trị có phải là object hay array không
        if(typeof obj[keyOfObj] === 'object' && !Array.isArray(obj[keyOfObj])) {

            // thì đệ quy tiếp =>  response là 1 object
            const response = this.updateNestedObjParse(obj[keyOfObj]);

            // duyệt từ giá trị key của response
            Object.keys(response).forEach( keyOfResponse => {
                results[`${keyOfObj}.${keyOfResponse}`] = response[keyOfResponse];
            });
        }
        else results[keyOfObj] =obj[keyOfObj];
    });

    return results;
}

// Object.keys giúp chuyển từ Object {} => một Array [] => giá trị là các key (khóa)
// Object.fromEntries giúp chuyển từ một Array [] => một Object {}
// Object.entries giúp chuyển từ một Object {} => một Array [] => các cặp key - value

// convert từ dạng String => ObjectId của mongoDB
module.exports.convertToObjectIdMongoDb = (id) => {
    return new Types.ObjectId(id);
}