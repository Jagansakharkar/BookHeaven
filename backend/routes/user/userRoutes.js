const express = require('express')
const router = express.Router()
const {  authenticationToken } = require('../../middleware/useAuth')
const { getUserById, updateUserAddress, updateProfile, getUserAddress } = require('../../controllers/user/userControllers')

// get particular user information
router.get('/', authenticationToken , getUserById)
// update user profile
router.post('/profile',authenticationToken , updateProfile)
// update user address
router.put('/address', authenticationToken , updateUserAddress)
// get user address
router.get('/address', authenticationToken , getUserAddress)

module.exports = router;