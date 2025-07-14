const express = require('express')
const {authenticateToken} = require("../../middleware/useAuth")
const router = express.Router()
const { getAllCustomers, getCustomerById,userSearch ,filterByGender} = require('../../controllers/admin/userControllers')

router.get("/get-all-customers", authenticateToken, getAllCustomers)
router.get('/get-customer-byId/:customerid', authenticateToken, getCustomerById)
router.get('/user-search',authenticateToken,userSearch)
router.post('/filter-by-gender',filterByGender)

module.exports=router