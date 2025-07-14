const router = require('express').Router();

const Order = require("../../models/order");
const User = require("../../models/user");
const sendOrderStatusEmail = require("../../utils/sendEmail")

exports.getAllOrders = async (req, res) => {

  try {
    const orders = await Order.find()
      .populate('userid', 'fullname email')   // populate user name/email
      .populate('books.bookid', 'title author')     // populate book title/author
      .sort({ order_date: -1 });               // sort by latest

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

exports.changeOrderStatus = async (req, res) => {
  const { orderid } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderid, { status }, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    // to send mail
    if (Order.userid?.email) {
      await sendOrderStatusEmail(Order.userid.email, status, Order);
    }
    console.log(updatedOrder)
    res.json({ success: true, message: "Status updated Successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
}

exports.getOrderById= async (req, res) => {
  const { orderid } = req.params;
  try {
    const order = await Order.findById(orderid)
      .populate('userid')
      .populate('books.bookid');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

exports.editOrder = async (req, res) => {
  const { orderid } = req.params;
  const { status, paymentStatus, acceptedDelivery } = req.body;

  try {
    const order = await Order.findById(orderid);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Apply updates only if values are provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (typeof acceptedDelivery === 'boolean') {
      order.acceptedDelivery = acceptedDelivery;
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

exports.deleteOrder=async(req,res)=>{
  const{orderid}=req.params

 try{
  const order=await Ordere.findByIdAndDelete(orderid)
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json({success:true, message: 'Order deleted successfully' });
}catch(error){
  res.status(500).json({success:false,message:"Error Occurred While Deleting Order"})
}
}


exports.changePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  const { orderid } = req.params;

  try {
    // Optional: Validate status if you want to restrict values
    const validStatuses = ['Pending', 'Paid', 'Failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderid,
      { paymentStatus },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log("Payment status updated:", updatedOrder);
    res.status(200).json({ success: true, data: updatedOrder });

  } catch (error) {
    console.error("Error updating payment status:", error.message);
    res.status(500).json({ success: false, message: "Error occurred while updating payment status" });
  }
};
