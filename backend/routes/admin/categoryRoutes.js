const express=require('express')
const router=express.Router()
const{addCategory}=require('../../controllers/admin/categoryControllers')
const {authenticateToken}=require('../../middleware/useAuth')

router.post('/add-category',authenticateToken,addCategory)

module.exports=router