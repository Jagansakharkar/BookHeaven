const router = require("express").Router();
const {  authenticationToken } = require('../../middleware/useAuth');
const { addToCart, removeFromCart, getUserCart, clearCart } = require('../../controllers/user/cartControllers');

// add to cart
router.put('/:bookId',  authenticationToken, addToCart);

// remove from cart
router.delete('/:bookId',  authenticationToken, removeFromCart);

// get all items in cart
router.get('/',  authenticationToken, getUserCart);

// clear cart
router.delete('/clear',  authenticationToken, clearCart);

module.exports = router;
