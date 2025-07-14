const express = require('express')
const router = require('express').Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { addToCart, removeFromCart, getUserCart, clearCart } = require('../../controllers/user/cartControllers')

router.put('/add-to-cart', authenticateToken, addToCart)
router.put('/remove-from-cart/:bookid', authenticateToken, removeFromCart)
router.get('/get-user-cart', authenticateToken, getUserCart)
router.delete('/cart/clear', authenticateToken, clearCart)

module.exports = router;