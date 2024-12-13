const _ = require('lodash');

module.exports.getInfoData = (object = {}, field = []) => {
    return _.pick(object, field);
}