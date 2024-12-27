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
router.get('/', asyncHandler(productController.findAllProduct));

router.get('/detail/:id', asyncHandler(productController.finDetailProduct));

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));

// ### middleware authetication ###
router.use(asyncHandler(authMiddleware.auth));
// ### end middleware authetication ###

router.post('/create', asyncHandler(productController.createProduct));

router.post('/isPublish/:id', asyncHandler(productController.isPublishProduct));

router.post('/isUnPublish/:id', asyncHandler(productController.isUnPublishProduct));

// update
router.patch('/update/:id', asyncHandler(productController.updateProduct));

// ### QUERY ###
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));

router.get('/published/all', asyncHandler(productController.getAllPublishForShop));


// export
module.exports = router;