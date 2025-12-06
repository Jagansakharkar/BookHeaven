const express = require('express')
const {  authenticationToken } = require("../../middleware/useAuth")
const router = express.Router()
const { userSearch, filterByGender,deleteUser, getUserById, getAllUsers } = require('../../controllers/admin/userControllers')

// get all users
router.get("/all",  authenticationToken, getAllUsers)
// user by id
router.get('/',  authenticationToken, getUserById)
// search customer
router.get('/search',  authenticationToken, userSearch)
// filter by gender
router.post('/filter-gender', filterByGender)
//delete user
router.delete('/', authenticationToken,deleteUser)

module.exports = router