const router = require("express").Router();
const Cart = require("../../models/cart");
const Book = require("../../models/books"); 
const { authenticateToken } = require("../../controller/useAuth");



// Add book to cart (NO quantity increment)
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const userid = req.user.id;
    const { bookid} = req.body;

    if (!bookid) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const book = await Book.findById(bookid);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const price = book.price;

    let cart = await Cart.findOne({ user_id: userid });

    if (!cart) {
      // 👇 New cart for user
      cart = await Cart.create({
        user_id: userid,
        items: [{ book_id: bookid, quantity: 1, price }]
      });
      return res.status(201).json({ success: true, message: "Book added to new cart", data: cart });
    }

    // 👇 Check if book already in cart
    const isAlreadyInCart = cart.items.some(item => item.book_id.toString() === bookid);

    if (isAlreadyInCart) {
      return res.status(200).json({ success: true, message: "Book is already in cart" });
    }

    // 👇 Add to cart
    cart.items.push({ book_id: bookid, quantity: 1, price });
    await cart.save();

    return res.status(200).json({ success: true, message: "Book added to cart", data: cart });
  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



//  Remove book from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const userid = req.user.id;

    const cart = await Cart.findOne({ user_id: userid });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.book_id.toString() !== bookid);
    await cart.save();

    return res.status(200).json({ success: true, message: "Book removed from cart", data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


//  Get user cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const userid = req.user.id;

    const cart = await Cart.findOne({ user_id: userid }).populate("items.book_id");
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// routes/user/cart.js
router.delete("/cart/clear", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
});

module.exports = router;
