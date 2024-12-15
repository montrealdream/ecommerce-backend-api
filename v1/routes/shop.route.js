// require package
const express = require('express');

// require middlware
const asyncHandler = require('../helpers/asyncHandler.helper');
const authMiddleware = require('../middleware/auth.middleware');

// init router
const router = express.Router();

// init controller
const shopController = require('../controllers/shop.controller');

// use
router.post( '/signup', asyncHandler(shopController.signUp) );
    
router.post( '/login', asyncHandler(shopController.login) );    

// ### middleware authetication ###
router.use(asyncHandler(authMiddleware.authentication));

router.post('/logout', shopController.logout);

// export
module.exports = router;