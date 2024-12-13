// require package
const express = require('express');

// require middlware
const asyncHandler = require('../middleware/handleError.middleware');

// init router
const router = express.Router();

// init controller
const shopController = require('../controllers/shop.controller');

// use
router.post(
    '/signup',
    asyncHandler(shopController.signUp)
);

// export
module.exports = router;