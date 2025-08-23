const express = require('express')
const router = express.Router()
const {authenticateToken }= require('../../middleware/useAuth')
const { userOrdersHistory, getUserOrders, trackOrder, placeOrder,getOrderById, cancelOrder } = require('../../controllers/user/orderControllers')

router.get('/:userId', authenticateToken, userOrdersHistory)
router.post('/cancel/:userId/:orderId', authenticateToken, cancelOrder)
router.get('/track/:userId/:orderId', authenticateToken, trackOrder)
router.post('/place-order/:userId', authenticateToken, placeOrder)
router.get('/:userId', authenticateToken, getUserOrders)
router.get('/:userId/:orderId',authenticateToken,getOrderById)
module.exports = router;