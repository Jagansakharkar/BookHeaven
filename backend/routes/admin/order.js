const router = require('express').Router();
const { authenticateToken } = require("../../controller/useAuth");
const Order = require("../../models/order");
const User = require("../../models/user");
const sendOrderStatusEmail = require("../../utils/sendEmail")

router.get('/get-all-orders', async (req, res) => {

  try {
    const orders = await Order.find()
      .populate('user_id', 'fullname email')   // populate user name/email
      .populate('book_id', 'title author')     // populate book title/author
      .sort({ order_date: -1 });               // sort by latest

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.put('/change-order-status/:orderid', async (req, res) => {
  const { orderid } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderid, { status }, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    // to send mail
    if (Order.user_id?.email) {
      await sendOrderStatusEmail(Order.user_id.email, status, Order);
    }
    res.json({ success: true, message: "Status updated Successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

router.get('/get-order-byId/:orderid', async (req, res) => {
  const { orderid } = req.params;
  try {
    const order = await Order.findById(orderid)
      .populate('user_id')
      .populate('book_id');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
)

router.put('/edit-order/:orderid', async (req, res) => {
  const { orderid } = req.params;
  const { status, address, quantity, contactNumber } = req.body;

  try {
    const order = await Order.findById(orderid);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update fields
    if (status) order.status = status;
    if (address) order.address = address;
    if (quantity) order.quantity = quantity;
    if (quantity) order.contactNumber = contactNumber;


    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
})

module.exports = router