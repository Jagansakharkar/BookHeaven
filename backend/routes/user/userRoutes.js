const express = require('express')
const router = express.Router()
const {authenticateToken }= require('../../middleware/useAuth')
const { getUserInformation, updateAddress, updateProfile, getUserAddress } = require('../../controllers/user/userControllers')

router.get('/get-user-information', authenticateToken, getUserInformation)
router.post('/update-profile', authenticateToken, updateProfile)
router.put('/update-address', authenticateToken, updateAddress)
router.get('/get-user-address', authenticateToken, getUserAddress)

module.exports = router;