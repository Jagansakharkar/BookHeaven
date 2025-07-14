const express=require('express')
const router=express.Router()
const{getAllCategories}=require('../../controllers/user/categoryControllers')
const {authenticateToken}=require('../../middleware/useAuth')

router.get('/get-all-categories',authenticateToken,getAllCategories)

module.exports=router