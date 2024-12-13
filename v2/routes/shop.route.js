const express = require('express');

// init router
const router = express.Router();

// init controller
const shopController = require('../controllers/shop.controller');

// use
router.post(
    '/signup',
    shopController.signUp
);

// export
module.exports = router;