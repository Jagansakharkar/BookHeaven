const Order = require("../../models/order");
const Cart=require('../../models/cart')
const User=require('../../models/user')

exports.getAllOrders = async (req, res) => {
  try {
    const userid = req.user.id; // user id from middleware/token

    const userOrders = await Order.find({ userid: userid })
      .populate({ path: "bookid" })  // get book details
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
}

exports.cancelOrder = async (req, res) => {
  try {
    const { orderid } = req.params;
    const userid = req.user.id; // or req.user.id if you store user id in req.user after auth

    const order = await Order.findOne({ _id: orderid, userid: userid });

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
}

// controllers/orderController.js
exports.trackOrder = async (req, res) => {
  const { orderid } = req.params;
  const { bookid } = req.query;

  try {
    const userid = req.user.id;

    const order = await Order.findOne({ _id: orderid, userid })
      .populate("books.bookid", "title author url price category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const book = order.books.find(b => b.bookid && b.bookid._id.toString() === bookid);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found in order",
      });
    }
    console.log(order.address)

    res.status(200).json({
      success: true,
      data: {
        book: book.bookid, // Populated book details
        quantity: book.quantity,
        price: book.price,
        itemStatus: order.status,
      },
      trackingId: order._id,
      estimatedDelivery: order.estimatedDelivery || null,
      address: order.address,
    });

  } catch (err) {
    console.error("Track order error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// GET all orders by user ID
exports.getUserOrders= async (req, res) => {
  try {
    const userid = req.user.id;

    const orders = await Order.find({ userid: userid })
      .populate('books.bookid')
      .sort({ createdAt: -1 });



    if (!orders.length) {
      return res.status(404).json({ success: true, message: "No orders found for this user." });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {

    res.status(500).json({ success: false, message: "Failed to retrieve orders." });
  }
}


exports.placeOrder = async (req, res) => {
  try {
    const userid = req.user.id;
    const { paymentMethod } = req.body;

    // 1. Get user's cart
    const cart = await Cart.findOne({ userid: userid });
    if (!cart || cart.books.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Get user's address
    const user = await User.findById(userid);
    if (!user || !user.address) {
      return res.status(400).json({ success: false, message: "User address not found" });
    }

    const createdOrders = [];

    // 3. Loop through books to create separate orders
    for (const bookItem of cart.books) {
      const book = await Book.findById(bookItem.bookid);

      //  Check stock availability
      if (!book || book.stock < bookItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${book?.title || 'Unknown Book'}"`
        });
      }

      // Reduce stock
      book.stock -= bookItem.quantity;
      await book.save();

      // Create order
      const order = new Order({
        userid: userid,
        books: [{
          bookid: bookItem.bookid,
          quantity: bookItem.quantity,
          price: bookItem.price,
          title: bookItem.title,
          desc: bookItem.desc,
          author: bookItem.author,
        }],
        totalAmount: bookItem.quantity * bookItem.price,
        address: {
          name: user.fullname,
          city: user.address.city,
          state: user.address.state,
          street: user.address.street,
          pincode: user.address.pincode,
          phoneno: user.address.phone,
        },
        status: "Placed",
        paymentMethod,
        paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending"
      });

      await order.save();
      createdOrders.push(order);
    }

    // 4. Clear user's cart
    cart.books = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Orders placed successfully",
      orders: createdOrders
    });

  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const { orderid } = req.params;
    const userid = req.user.id;

    const order = await Order.findOne({
      _id: orderid,
     
    }).populate('books.bookid'); // optional, in case you want full book details

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }


    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// exports.createOrder= async (req, res) => {
//   const userid = req.user.id;
//   const { address, cartItems, paymentMethod } = req.body;
 
//     const totalAmount = cartItems.reduce((acc, item) => {
//       console.log("item", item)
//       const qty = parseInt(item.quantity) || 0;
//       const price = parseFloat(item.price) || 0;
//       return acc + qty * price;
//     }, 0);

//     const newOrder = new Order({
//       userid: userid,
//       address,
//       items: cartItems.map(item => ({
//         book_id: item.bookid,
//         quantity: item.quantity,
//         price: item.price
//       })),
//       totalAmount,
//       payment: {
//         method: paymentMethod,
//         status: paymentMethod === "COD" ? "Pending" : "Paid"
//       },
//       status: "Order Placed",
//       estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days later
//     });

//     await newOrder.save();
//     console.log(newOrder)


//     res.status(200).json({
//       message: "Order created successfully",
//       orderid: newOrder._id,
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({ success: false, message: "Error creating order" });
//   }
// }



