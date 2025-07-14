const router = require("express").Router();
const User = require("../../models/user");
const Book = require("../../models/books");

//get all the books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('category', 'name');

    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message
    });
  }
}
// add new books
exports.addBook = async (req, res) => {
  const { url, title, author, price, desc, language, category,publisher,publishedDate,pages } = req.body;
  const userid = req.user.id

  console.log(category)
  try {

    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ success: false, message: "No admin access" });

    const book = new Book({ url, title, author, price, desc, language, category,publisher,publishedDate,pages  });
    await book.save();
    res.status(200).json({ success: true, message: "Book added successfully" });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
// Update book 
exports.updatedBook = async (req, res) => {
  try {
    const { bookid } = req.params;

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      {
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        stock: req.body.stock,
        language: req.body.language,
        category: req.body.category,
        publisher:req.user.publisher,
        publishedDate:req.body.publishedDate,
        pages:req.body.pages
      },

      { new: true }
    );



    res.status(200).json({ success: true, message: "Book updated successfully" });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Delete book route
exports.deleteBook = async (req, res) => {
  try {
    const userid = req.user.id
    const { bookid } = req.params
    await Book.findByIdAndDelete(bookid);
    
    return res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
}

exports.bookSearch = async (req, res) => {

  try {
    const { title } = req.query;

    // If no title provided, return all books or an empty array
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const regex = new RegExp(title, 'i'); // case-insensitive search
    const books = await Book.find({ title: regex });

    res.json({ success: true, data: books });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}




