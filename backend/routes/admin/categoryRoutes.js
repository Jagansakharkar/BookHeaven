const express=require('express')
const router=express.Router()
const{addCategory}=require('../../controllers/admin/categoryControllers')
const { authenticationToken}=require('../../middleware/useAuth')

router.post('/', authenticationToken,addCategory)

module.exports=router