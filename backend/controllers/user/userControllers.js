

const User = require("../../models/user")

// Get user information
exports.getUserInformation = async (req, res) => {
  try {
    const userid = req.user.id

    const userData = await User.findById(userid).select('-password')
    // - means exclude the password do not select it

    if (!userData) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ success: true, data: userData })
  } catch (error) {
    console.error(`An Error occurred: ${error}`)
    res.status(500).json({ message: `Server Error: ${error.message}` }) // Respond with status 500 for server errors
  }
}

// update address
exports.updateAddress = async (req, res) => {
  try {
    const userid = req.user.userid
    const address = req.body

    await User.findByIdAndUpdate(userid, { address: address })
    // right side address is updated address

    return res.status(200).json({ success: true, message: "Address updated successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// update profile by user
exports.updateProfile = async (req, res) => {
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
}

// get user address
exports.getUserAddress = async (req, res) => {
  const userid = req.user.id
  try {
    const user = await User.findById(userid)
    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" })
    }
    res.status(200).json({ success: true, data: user })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error Loading Address',
    });
  }

}



