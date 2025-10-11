const router = require('express').Router();

const Order = require("../../models/order");
const User = require("../../models/user");
const sendOrderStatusEmail = require("../../utils/sendEmail")

exports.getAllOrders = async (req, res) => {
  try {
    const userOrders = await Order.find()
      .populate('books.book')  
      .sort({ createdAt: -1 });    

    return res.status(200).json({
      success: true,
      data: userOrders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders"
    });
  }
}


exports.changeOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    // to send mail
    if (Order.user?.email) {
      await sendOrderStatusEmail(Order.user.email, status, Order);
    }
    res.json({ success: true, message: "Status updated Successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId)
      .populate('user',"fullname")
      .populate('books.book');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

exports.editOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus, acceptedDelivery } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Apply updates only if values are provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (delivery) {
      order.delivery = deliveryDate;
    }
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
};

exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId)
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred While Deleting Order" })
  }
}

exports.changePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  const { orderId } = req.params;

  try {
    // Optional: Validate status if you want to restrict values
    const validStatuses = ['Pending', 'Paid', 'Failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: updatedOrder });

  } catch (error) {
    console.error("Error updating payment status:", error.message);
    res.status(500).json({ success: false, message: "Error occurred while updating payment status" });
  }
};
