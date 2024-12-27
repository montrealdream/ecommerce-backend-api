// model
const Inventory = require('../inventory.model');

// mongoose
const { Types } = require('mongoose');

module.exports.insertInventory = async ({ productId, shopId, stock, location = "" }) => {
    return await Inventory.create({
        inventory_productId: productId,
        inventory_shopId: shopId,
        inventory_location: location,
        inventory_stock: stock
    })
}