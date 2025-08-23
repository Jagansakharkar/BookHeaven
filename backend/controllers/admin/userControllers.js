const router = require('express').Router();
const User = require("../../models/user");

// Fetch all customers 
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ role: 'user' });

    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
}

exports.getUserById = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.find({ _id: userid })
    if (!user) {
      res.status(403).json({ success: true, message: "User Not Found" })
    }

    res.status(200).json({ success: true, data: customer })
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the customer" })
  }
}

exports.userSearch = async (req, res) => {
  const { term } = req.query
  try {
    if (!term || term.trim() === '') {
      return res.status(400).json({ success: false, message: 'username or email or name is required for search' });
    }

    const useReg = new RegExp(term, 'i')
    const user = await User.find(
      {
        $or: [
          { username: useReg },
          { email: useReg },
          { fullname: useReg }
        ]
      })

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred while searching " })
  }
}

// filter by gender
exports.filterByGender = async (req, res) => {
  const { gender } = req.body;

  try {
    // Optional: Validate gender input
    if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid gender' });
    }

    // Query MongoDB
    const users = await User.find({ gender });

    res.status(200).json({ success: true, data: users });
  } catch (error) {

    res.status(500).json({ success: false, message: 'Error occurred while filtering' });
  }
};

exports.getUserAddress = async (req, res) => {
  const { userId } = req.params
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
    const { userId } = req.params; // assuming middleware sets req.user
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
    const {userid} = req.params; // from auth middleware

    const {
      fullname,
      username,
      email,
      avatar,
      birthDate,
      gender
    } = req.body;

    // Update fields only if they are present in the request
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
exports.deleteUser=async(req,res)=>{
  const{userId}=req.params
try{
  const deleteUser=await User.findByIdAndDelete(userId)
  res.status(200).json({success:true,data:deleteUser})
}catch(error){
  res.status(500).json({success:false,message:'Failed to delete user'})
}
}
