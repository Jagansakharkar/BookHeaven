const express = require('express')
const { authenticateToken } = require("../../middleware/useAuth")
const router = express.Router()
const { userSearch, filterByGender,deleteUser, getUserById, getAllUsers } = require('../../controllers/admin/userControllers')

// get all users
router.get("/", authenticateToken, getAllUsers)
// user by id
router.get('/:userId', authenticateToken, getUserById)
// search customer
router.get('/search', authenticateToken, userSearch)
// filter by gender
router.post('/filter-gender', filterByGender)
//delete user
router.delete('/:userId',authenticateToken,deleteUser)

module.exports = router