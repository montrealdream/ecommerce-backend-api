// require package
const express = require('express');

// require middlware
const asyncHandler = require('../helpers/asyncHandler.helper');
const authMiddleware = require('../middleware/auth.middleware');

// init router
const router = express.Router();

// init controller
const cartController = require('../controllers/cart.controller');

// use
router.get( '/', asyncHandler(cartController.list) );    
router.post( '/add', asyncHandler(cartController.addToCart) );    
router.post( '/update', asyncHandler(cartController.update) );    
router.delete('/delete', asyncHandler(cartController.delete) );    


// ### middleware authetication ###
router.use(asyncHandler(authMiddleware.auth));


// export
module.exports = router;