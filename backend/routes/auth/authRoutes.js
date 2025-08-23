const express = require("express")
const router = express.Router()
const { signup, login, forgotPassword, resetPassword } = require('../../controllers/auth/authControllers')
const { validateSignUpFields,validateLoginFields } = require('../../middleware/validateFields')
const { validationResult } = require('express-validator')

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post("/signup", validateSignUpFields, validateRequest, signup);
router.post("/login", validateLoginFields, validateRequest, login);

router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:id/:token', resetPassword)

module.exports = router;