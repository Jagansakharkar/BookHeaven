const express = require('express')
const {  authenticationToken } = require("../../middleware/useAuth")
const router = express.Router()
const { userSearch, filterByGender,deleteUser, getUserById, getAllUsers } = require('../../controllers/admin/userControllers')

// get all users
router.get("/",  authenticationToken, getAllUsers)
// user by id
router.get('/user',  authenticationToken, getUserById)
// search customer
router.get('/search',  authenticationToken, userSearch)
// filter by gender
router.post('/filter-gender', filterByGender)
//delete user
router.delete('/', authenticationToken,deleteUser)

module.exports = router