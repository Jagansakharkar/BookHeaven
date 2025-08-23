const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../../middleware/useAuth')
const { getUserById, updateUserAddress, updateProfile, getUserAddress } = require('../../controllers/user/userControllers')

// get particular user information
router.get('/:userId', authenticateToken, getUserById)
// update user profile
router.post('/profile/:userId', authenticateToken, updateProfile)
// update user address
router.put('/address/:userId', authenticateToken, updateUserAddress)
// get user address
router.get('/address/:userId', authenticateToken, getUserAddress)

module.exports = router;