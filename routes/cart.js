const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const cart = require('../controllers/cart');

router.get('/cart', isLoggedIn, cart.renderCart);
router.post('/cart/add', isLoggedIn, catchAsync(cart.addToCart));
router.post('/cart/remove/:index', isLoggedIn, cart.removeFromCart);
router.post('/cart/checkout', isLoggedIn, catchAsync(cart.checkout));

module.exports = router;
