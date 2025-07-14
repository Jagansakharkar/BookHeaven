const router = require('express').Router();
const { authenticateToken } = require("../../controller/useAuth");
const Order = require("../../models/order");
const User = require("../../models/user");
const Book = require("../../models/books")




router.get('/get-all-orders', authenticateToken, async (req, res) => {
  try {
    const userid  = req.user.id; // user id from middleware/token

    const userOrders = await Order.find({ user_id: userid })
      .populate({ path: "book_id" })  // get book details
      .sort({ createdAt: -1 });    // newest orders first

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
});

router.post('/cancel-order/:orderid', authenticateToken, async (req, res) => {
  try {
    const {orderid} = req.params;
    const userid = req.user.id; // or req.user.id if you store user id in req.user after auth

    const order = await Order.findOne({ _id: orderid, user_id: userid });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
    }

    // Check if order is already canceled
    if (order.status === 'Canceled') {
      return res.status(400).json({ success: false, message: 'Order already canceled' });
    }

    // Update the order status to 'Canceled'
    order.status = 'Canceled';
    await order.save();

    return res.status(200).json({ success: true, message: 'Order canceled successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

router.get('/track-order/:orderid', authenticateToken, async (req, res) => {
  const { orderid } = req.params;          // ✅ From URL param
  const { bookid } = req.query;            // ✅ From query param
try{
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user_id: userId })
      .populate("items.book_id", "title author url price category");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const item = order.items.find(i => i._id.toString() === bookid);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in order" });
    }

    res.status(200).json({
      success: true,
      data: {
        book: item.book_id,
        quantity: item.quantity,
        price: item.price,
        itemStatus: item.itemStatus ?? order.status
      },
      trackingId: order.trackingId,
      estimatedDelivery: order.estimatedDelivery,
      address: order.address // ✅ Address added here
    });
  } catch (err) {
    console.error("Track item error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// GET all orders by user ID
router.get("/get-user-orders", authenticateToken, async (req, res) => {
  try {
    const userid = req.user.id;

    const orders = await Order.find({ user_id: userid })
      .populate('items.book_id')
      .sort({ createdAt: -1 }); 

    if (!orders.length) {
      return res.status(404).json({ success: true, message: "No orders found for this user." });
    }

    res.status(200).json({ success: true, data:orders });
  } catch (error) {
   
    res.status(500).json({ success: false, message: "Failed to retrieve orders." });
  }
});

router.post("/create-order", authenticateToken, async (req, res) => {
  const userid = req.user.id;
  const { address, cartItems, paymentMethod } = req.body;
console.log(cartItems)
  try {
    const totalAmount = cartItems.reduce((acc, item) => {
      console.log("item",item)
      const qty = parseInt(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return acc + qty * price;
    }, 0);

    const newOrder = new Order({
      user_id: userid,
      address,
      items: cartItems.map(item => ({
        book_id: item.bookid,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "COD" ? "Pending" : "Paid"
      },
      status: "Order Placed",
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days later
    });

    await newOrder.save();
    console.log(newOrder)


    res.status(200).json({
      message: "Order created successfully",
      orderid: newOrder._id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
});


module.exports = router;
