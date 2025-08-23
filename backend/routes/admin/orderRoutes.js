const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { getAllOrders, changeOrderStatus, getOrderById,deleteOrder, editOrder,changePaymentStatus } = require('../../controllers/admin/orderControllers')

router.get("/", authenticateToken, getAllOrders)
router.put('/change-order-status/:orderId', authenticateToken, changeOrderStatus)
router.put('/change-payment-status/:orderId', authenticateToken, changePaymentStatus)
router.get("/:orderId", authenticateToken, getOrderById)
router.put("/edit/:orderId", authenticateToken, editOrder)
router.delete("/:orderId",authenticateToken,deleteOrder)

module.exports=router

