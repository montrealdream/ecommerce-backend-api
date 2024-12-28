// require package
const express = require('express');

// require middlware
const asyncHandler = require('../helpers/asyncHandler.helper');
const authMiddleware = require('../middleware/auth.middleware');

// init router
const router = express.Router();

// init controller
const discountController = require('../controllers/discount.controller');

// use
// router.post( '/signup', asyncHandler(shopController.signUp) );
    
router.get( '/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct) );    

router.post( '/amount', asyncHandler(discountController.getDiscountAmout) );    

// ### middleware authetication ###
router.use(asyncHandler(authMiddleware.auth));

router.post('/create', asyncHandler(discountController.createDiscountCode));

// router.post('/refreshToken', asyncHandler(shopController.refreshToken));

// export
module.exports = router;