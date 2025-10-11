const router = require('express').Router();
const User = require("../../models/user");

exports.getUserById = async (req, res) => {
const userId=req.user.id
  try {
    const user = await User.findById(userId )
    if (!user) {
      res.status(403).json({ success: true, message: "User Not Found" })
    }

    res.status(200).json({ success: true, data: user })
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the customer" })
  }
}

exports.getUserAddress = async (req, res) => {
const userId=req.user.id
  try {
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" })
    }
    res.status(200).json({
      success: true, data: user.address
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error occurred while fetching user Address' });
  }
}

exports.updateUserAddress = async (req, res) => {
  try {
const userId=req.user.id
    const {
      fullname,
      phone,
      street,
      city,
      state,
      pincode
    } = req.body;

    // Optional: validate fields here or use express-validator

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        address: {
          fullname,
          phone,
          street,
          city,
          state,
          pincode
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedUser.address
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
const userId=req.user.id
    const {
      fullname,
      username,
      email,
      avatar,
      birthDate,
      gender
    } = req.body;

    const updateFields = {};
    if (fullname) updateFields.fullname = fullname;
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (avatar) updateFields.avatar = avatar;
    if (birthDate) updateFields.birthDate = birthDate;
    if (gender) updateFields.gender = gender;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        birthDate: updatedUser.birthDate,
        gender: updatedUser.gender,
        role: updatedUser.role,
        address: updatedUser.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
