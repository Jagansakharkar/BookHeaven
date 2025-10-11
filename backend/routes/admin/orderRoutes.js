const express = require('express')
const router = express.Router()
const { authenticationToken} = require('../../middleware/useAuth')
const { getAllOrders, changeOrderStatus, getOrderById,deleteOrder, editOrder,changePaymentStatus } = require('../../controllers/admin/orderControllers')

router.get("/",  authenticationToken, getAllOrders)
router.put('/change-order-status/:orderId',  authenticationToken, changeOrderStatus)
router.put('/change-payment-status/:orderId',  authenticationToken, changePaymentStatus)
router.get("/:orderId",  authenticationToken, getOrderById)
router.put("/edit/:orderId",  authenticationToken, editOrder)
router.delete("/:orderId", authenticationToken,deleteOrder)

module.exports=router

