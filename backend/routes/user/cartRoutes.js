const router = require("express").Router();
const {  authenticationToken } = require('../../middleware/useAuth');
const { addToCart, removeFromCart, getUserCart, clearCart,updateQuantity } = require('../../controllers/user/cartControllers');

// get all items in cart
router.get('/',  authenticationToken, getUserCart);

// clear cart
router.delete('/clear',authenticationToken, clearCart);

// add to cart
router.put('/:bookId',  authenticationToken, addToCart);

// remove from cart
router.delete('/:bookId',  authenticationToken, removeFromCart);

// update quantity
router.patch("/update-quantity/:bookId",authenticationToken,updateQuantity)

module.exports = router;
