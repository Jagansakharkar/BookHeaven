const express = require('express')
const User = require("../../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

// Signup
exports.signup = async (req, res) => {
  const { fullname, username, email, password, address } = req.body

  try {
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
}

// login
exports.login = async (req, res) => {
  const { username, password } = req.body
  console.log("username",username,password)

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

     res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
    // Sign-in success response
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      data:{
         userId:authClaims.id,
         role:authClaims.role
      }
      
    })
  } catch (error) {
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` }) // Respond with status 500 for server errors
  }
}

//✔ Send Reset Link
exports.forgotPassword= async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id },process.env.SECRET_KEY, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your@gmail.com",
        pass: "your-app-password",
      },
    });

    const mailOptions = {
      from: "your@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// ✔ Reset Password
exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashed });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
}

exports.getMe = async (req, res) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password'); // Find user and exclude password
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

exports.logout=async(req,res)=>{
  res.clearCookie("token");
res.json({ success: true, message: "Logged out" });
}