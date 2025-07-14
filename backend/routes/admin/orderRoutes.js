const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { getAllOrders, changeOrderStatus, getOrderById,deleteOrder, editOrder,changePaymentStatus } = require('../../controllers/admin/orderControllers')

router.get("/get-all-orders", authenticateToken, getAllOrders)
router.put('/change-order-status/:orderid', authenticateToken, changeOrderStatus)
router.put('/change-payment-status/:orderid', authenticateToken, changePaymentStatus)
router.get("/get-order-byId/:orderid", authenticateToken, getOrderById)
router.put("/edit-order/:orderid", authenticateToken, editOrder)
router.delete("/delete-order/:orderid",authenticateToken,deleteOrder)

module.exports=router

