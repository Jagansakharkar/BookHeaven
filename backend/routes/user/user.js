const express = require('express')
const router = express.Router()
const User = require("../../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const { authenticateToken } = require("../../controller/useAuth");

require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post('/sign-up', async (req, res) => {
  const { fullname, username, email, password, address } = req.body


  try {
    // Checking username length
    if (username.length < 4) {
      return res.status(400).json({ message: "Username length should be greater than 3" })
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" })
    }

    // Check if email already exists
    const existingMail = await User.findOne({ email })
    if (existingMail) {
      return res.status(400).json({ message: "Email already exists" })
    }

    // Check password length
    if (password.length <= 5) {
      return res.status(400).json({ message: "Password length should be greater than 5" })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      address
    })

    // Save new user to the database
    await newUser.save()

    // Successful sign-up response
    res.status(200).json({ success: true, message: "Successfully Signed Up" })
  } catch (error) {
    console.error(`An Error occurred: ${error}`)
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` }) // Respond with status 500 for server errors
  }
})

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if the username exists
    const existingUser = await User.findOne({ username })

    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Invalid username or password" })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid username or password" })
    }

    // Create auth claims for the JWT
    const authClaims = {
      id: existingUser._id,
      role: existingUser.role
    }

    // Generate and sign JWT token
    const token = jwt.sign(authClaims, process.env.SECRET_KEY, { expiresIn: "30d" })

    // Sign-in success response
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      userid: existingUser._id,
      role: existingUser.role,
      token
    })
  } catch (error) {
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` }) // Respond with status 500 for server errors
  }
})

// Get user information
router.get('/get-user-information', authenticateToken, async (req, res) => {
  try {
    const userid=req.user.id
    console.log(userid)
    
    const userData = await User.findById(userid).select('-password')
    // - means exclude the password do not select it
    console.log(userData)

    if (!userData) {
      return res.status(404).json({ message: "User not found" })
    }


    return res.status(200).json({success:true,data:userData})
  } catch (error) {
    console.error(`An Error occurred: ${error}`)
    res.status(500).json({ message: `Server Error: ${error.message}` }) // Respond with status 500 for server errors
  }
})

// update address
router.put("/update-address/", authenticateToken, async (req, res) => {
  try {
    const  userid  = req.user.userid
    const address = req.body

    await User.findByIdAndUpdate(userid, { address: address })
    // right side address is updated address

    return res.status(200).json({ success: true, message: "Address updated successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// update profile by user
router.post('/update-profile', authenticateToken, async (req, res) => {
  const userid = req.user.userid; // from auth middleware
  const updateFields = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userid, updateFields, { new: true });
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
})

// get user address
router.get('/get-user-address',authenticateToken, async (req, res) => {
  const userid=req.user.id
try{
  const user=await User.findById(userid)
  if(!user){
    res.status(404).json({success:false,message:"User Not Found"})
  }
  res.status(200).json({success:true,data:user})
}
catch(error){
  return res.status(500).json({
      success: false,
      message: 'Error Loading Address',
    });
}

})




module.exports = router
