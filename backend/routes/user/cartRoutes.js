const router = require("express").Router();
const { authenticateToken } = require('../../middleware/useAuth');
const { addToCart, removeFromCart, getUserCart, clearCart } = require('../../controllers/user/cartControllers');

// add to cart
router.put('/add/:userId/:bookId', authenticateToken, addToCart);

// remove from cart
router.delete('/remove/:userId/:bookId', authenticateToken, removeFromCart);

// get all items in cart
router.get('/:userId', authenticateToken, getUserCart);

// clear cart
router.delete('/clear/:userId', authenticateToken, clearCart);

module.exports = router;
