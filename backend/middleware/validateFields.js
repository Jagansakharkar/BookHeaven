const { body } = require('express-validator')

exports.validateSignUpFields = [
  body('fullname')
    .trim()
    .notEmpty().withMessage("Fullname is required")
    .isLength({ min: 5 }).withMessage("Fullname should have atleast 5 characters"),
  body('username')
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 5 }).withMessage("Username should have atleast 5 character"),
  body('email')
    .trim()
    .isEmail().withMessage("Provide email in proper format"),
  body('password')
    .trim()
    .notEmpty().withMessage("Password Needed")
    .isLength({ min: 6 }).withMessage("Password must contain atleast 6 characters")
]

exports.validateLoginFields = [
  body('username')
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 5 }).withMessage("Username should have atleast 5 character"),
  body('password')
    .trim()
    .notEmpty().withMessage("Password Needed")
    .isLength({ min: 6 }).withMessage("Password must contain atleast 6 characters")
]