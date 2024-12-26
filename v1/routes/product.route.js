// require package
const express = require('express');

// require middlware
const asyncHandler = require('../helpers/asyncHandler.helper');
const authMiddleware = require('../middleware/auth.middleware');

// init router
const router = express.Router();

// init controller
const productController = require('../controllers/product.controller');

// use  

// ### middleware authetication ###
router.use(asyncHandler(authMiddleware.auth));

router.post('/create', asyncHandler(productController.createProduct));

// ### QUERY ###
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));

// export
module.exports = router;