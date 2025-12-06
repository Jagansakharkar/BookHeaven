const Order = require("../../models/order");
const Cart = require('../../models/cart')
const User = require('../../models/user')
const Book = require('../../models/books')

exports.userOrdersHistory = async (req, res) => {
  try {
const userId=req.user.id
    const userOrders = await Order.find({ user: userId })
      // .populate('books.book')  // get book details
      // .sort({ createdAt: -1 });    // newest orders first


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
    const { orderId} = req.params;
const userId=req.user.id
    const order = await Order.findOne({ _id: orderId, userId: userId });

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

exports.trackOrder = async (req, res) => {
  const { orderId} = req.params;
const userId=req.user.id
  const { bookId } = req.query;
  try {
   
    const order = await Order.findOne({ _id: orderId, userId })
      .populate("books.book", "title author url price category isbn deliveryDate paymentMethod");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const book = order.books.find(b => b.book && b.book._id.toString() === bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found in order",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        book: book._id, // Populated book details
        quantity: book.quantity,
        price: book.price,
        itemStatus: order.status,
      },
      trackingId: order._id,
      estimatedDelivery: order.deliveryDate || null,
      address: order.address,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET all orders by user ID
exports.getUserOrders = async (req, res) => {
  try {
const userId=req.user.id
    const orders = await Order.find({ userId: userId })
      .populate('books.book')
      .sort({ createdAt: -1 });

if (!orders.length) {
  return res.status(200).json({ success: true, data: [] });
}


    res.status(200).json({ success: true, data: orders });
  } catch (error) {

    res.status(500).json({ success: false, message: "Failed to retrieve orders." });
  }
}

exports.placeOrder = async (req, res) => {
  try {
const userId=req.user.id
    const { paymentMethod, address } = req.body;

    // 1. Get user's cart
    const cart = await Cart.findOne({ userId: userId });
    if (!cart || cart.books.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Get user's address
    const user = await User.findById(userId);
    if (!user || !user.address) {
      return res.status(400).json({ success: false, message: "User address not found" });
    }

    const createdOrders = [];

    // 3. Loop through books to create separate orders
    for (const bookItem of cart.books) {
      const book = await Book.findById(bookItem._id);

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
        userId: userId,
        books: [{
          bookid: bookItem._id,
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
          phone: user.address.phone,
        },
        status: "Placed",
        paymentMethod,
        paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending",
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
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
    const { orderId } = req.params;
const userId=req.user.id
    // Find order by ID and user, populate book info
    const order = await Order.findOne({
      _id: orderId,
      userId
    }).populate('books.book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or does not belong to this user"
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
