const router = require("express").Router();
const Cart = require("../../models/cart");
const Book = require("../../models/books");


// Add book to cart (NO quantity increment)
exports.addToCart = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    // If no cart, create new
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        books: [{
          book: bookId,
          quantity: 1,
          priceAtAdded: book.price
        }]
      });
      console.log("cart",cart)

      return res.status(201).json({ success: true, message: "Book added to new cart", data: cart });
    }

    // Check if book already exists
    const isAlreadyInCart = cart.books.some(item => item.book.toString() === bookId);
    if (isAlreadyInCart) {
      return res.status(200).json({ success: true, message: "Book is already in cart" });
    }

    // Add book to existing cart
    cart.books.push({
      book: bookId,
      quantity: 1,
      priceAtAdded: book.price
    });

    await cart.save();

    return res.status(200).json({ success: true, message: "Book added to cart", data: cart });

  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//  Remove book from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { bookId,userId } = req.params;
    

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.books = cart.books.filter(book => book._id.toString() !== bookId);
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
    const { userId } = req.params;

    // match with schema field name -> user
    const cart = await Cart.findOne({ user: userId }).populate("books.book");

    if (!cart || cart.books.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Nothing in the cart",
        data: []
      });
    }

    console.log("cart", cart);

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
    const{userId}=req.params
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
}


