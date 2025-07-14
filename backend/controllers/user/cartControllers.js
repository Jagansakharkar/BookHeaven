const router = require("express").Router();
const Cart = require("../../models/cart");
const Book = require("../../models/books");


// Add book to cart (NO quantity increment)
exports.addToCart = async (req, res) => {
  try {
    const userid = req.user.id;
    const { bookid } = req.body;

    if (!bookid) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const book = await Book.findById(bookid);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    let cart = await Cart.findOne({ userid });

    // 🔹 If no cart, create new
    if (!cart) {
      cart = await Cart.create({
        userid,
        books: [{
          bookid,
          quantity: 1,
          price: book.price,
          title: book.title,
          desc: book.desc,
          author: book.author,
          category: book.category
        }]
      });

      return res.status(201).json({ success: true, message: "Book added to new cart", data: cart });
    }

    // 🔹 Check if book already exists
    const isAlreadyInCart = cart.books.some(item => item.bookid.toString() === bookid);
    if (isAlreadyInCart) {
      return res.status(200).json({ success: true, message: "Book is already in cart" });
    }

    // 🔹 Add book to existing cart
    cart.books.push({
      bookid,
      quantity: 1,
      price: book.price,
      title: book.title,
      desc: book.desc,
      author: book.author,
      category: book.category
    });

    await cart.save();

    return res.status(200).json({ success: true, message: "Book added to cart", data: cart });

  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

//  Remove book from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { bookid } = req.params;
    const userid = req.user.id;

    const cart = await Cart.findOne({ userid: userid });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.books = cart.books.filter(book => book.bookid.toString() !== bookid);
    await cart.save();

    return res.status(200).json({ success: true, message: "Book removed from cart", data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


//  Get user cart
exports.getUserCart = async (req, res) => {
  try {
    const userid = req.user.id;

    const cart = await Cart.findOne({ userid }).populate("books.bookid");

    if (!cart || cart.books.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Nothing in the cart",
        data: []  // return an empty array so frontend can handle it gracefully
      });
    }

    return res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error("Error in getUserCart:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};


// routes/user/cart.js
exports.clearCart = async (req, res) => {
  try {
    const userid = req.user.id;
    await User.findByIdAndUpdate(userid, { $set: { cart: [] } });
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
}


