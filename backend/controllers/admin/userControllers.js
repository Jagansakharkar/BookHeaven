const router = require('express').Router();
const User = require("../../models/user");

// Fetch all customers 
exports.getAllCustomers = async (req, res) => {
  try {
    const allUsers = await User.find({ role: 'user' });

    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
}

exports.getCustomerById = async (req, res) => {
  const {customerid} =req.params 

  try {
    const customer = await User.find({ _id: customerid })
    console.log("customer",customer);

    res.status(200).json({ success: true, data: customer })
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the customer" })
  }
}

exports.userSearch=async(req,res)=>{
  const{term}=req.query
  try{
   if(!term || term.trim()===''){
      return res.status(400).json({ success: false, message: 'username or email or name is required for search' });
    }

    const useReg=new RegExp(term,'i')
    const user=await User.find(
    {
     $or:[
      {username:useReg},
      {email:useReg},
      {fullname:useReg}
      ]
    })

    console.log(user)

res.status(200).json({success:true,data:user})
}catch(error){
  res.status(500).json({success:false,message:"Error Occurred while searching "})
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
    console.error('Gender filter error:', error); // ✅ Log error for debugging
    res.status(500).json({ success: false, message: 'Error occurred while filtering' });
  }
};
