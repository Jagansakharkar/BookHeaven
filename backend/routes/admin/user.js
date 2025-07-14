const router = require('express').Router();
const { authenticateToken } = require("../../controller/useAuth");
const User = require("../../models/user");

// Fetch all customers 
router.get('/get-all-customers', authenticateToken, async (req, res) => {
  try {
    const allUsers = await User.find({ role: 'user' });

    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
});

router.get('/get-customer-byID/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id
  try {
    const customer = await User.find({ _id: userId })
    console.log(customer);

    res.status(200).json({ success: true, data: customer })
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the customer" })
  }
})

module.exports = router;
