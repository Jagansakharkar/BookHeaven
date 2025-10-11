const express = require('express')
const router = express.Router()
const { authenticationToken }= require('../../middleware/useAuth')
const { userOrdersHistory, getUserOrders, trackOrder, placeOrder,getOrderById, cancelOrder } = require('../../controllers/user/orderControllers')

router.get('/history',  authenticationToken, userOrdersHistory)
router.post('/cancel/:orderId',  authenticationToken, cancelOrder)
router.get('/track/:orderId',  authenticationToken, trackOrder)
router.post('/place-order',  authenticationToken, placeOrder)
router.get('/',  authenticationToken, getUserOrders)
router.get('/:orderId', authenticationToken,getOrderById)
module.exports = router;