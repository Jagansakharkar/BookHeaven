const express = require("express")
const router = express.Router()
const { signup, login, forgotPassword, resetPassword } = require('../../controllers/auth/authControllers')

router.post('/sign-up', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:id/:token', resetPassword)

module.exports = router;