// require package
const express = require('express');

// require middlware
const asyncHandler = require('../helpers/asyncHandler.helper');
const authMiddleware = require('../middleware/auth.middleware');

// init router
const router = express.Router();

// init controller
const checkoutController = require('../controllers/checkout.controller');

// use
router.post('/review', asyncHandler(checkoutController.checkoutReview) );    

// ### middleware authetication ###
router.use(asyncHandler(authMiddleware.auth));

// export
module.exports = router;