const express = require('express')
const router = express.Router()
const {authenticateToken }= require('../../middleware/useAuth')
const { getAllOrders, getUserOrders, trackOrder, placeOrder,getOrderById, cancelOrder } = require('../../controllers/user/orderControllers')

router.get('/get-all-orders', authenticateToken, getAllOrders)
router.post('/cancel-order/:orderid', authenticateToken, cancelOrder)
router.get('/track-order/:orderid', authenticateToken, trackOrder)
router.post('/place-order', authenticateToken, placeOrder)
router.get('/get-user-orders', authenticateToken, getUserOrders)
router.get('/get-order-byId/:orderid',authenticateToken,getOrderById)
module.exports = router;