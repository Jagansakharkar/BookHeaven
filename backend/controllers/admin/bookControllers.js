const router = require("express").Router();
const User = require("../../models/user");
const Book = require("../../models/books");
const slugify = require('slugify')

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
  try {
    const {
      url, title, author, price, desc, language, category,
      publisher, publishedDate, pages, isbn, isFeatured,
      stock, formatType
    } = req.body;

    const user = req.user; // You had `req.user.id`, but then used `user.role`, so changed it to `req.user`

    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "No admin access" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const book = new Book({
      url,
      title,
      slug,
      author,
      price,
      desc,
      language,
      category,
      publisher,
      publishedDate,
      pages,
      isbn,
      isFeatured,
      stock,
      formats: [{
        formatType,
        price,
        stock
      }]
    });

    await book.save();

    res.status(200).json({ success: true, message: "Book added successfully", data: book });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update book 

exports.updatedBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const {
      url,
      title,
      author,
      price,
      desc,
      stock,
      language,
      category,
      publisher,
      publishedDate,
      pages,
      isbn,
      tags,
      isFeatured,
      formats
    } = req.body;

    // Generate slug from title
    const slug = slugify(title, { lower: true });

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        url,
        title,
        slug,
        author,
        price,
        desc,
        stock,
        language,
        category,
        publisher,
        publishedDate,
        pages,
        isbn,
        tags,
        isFeatured,
        formats
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete book route
exports.deleteBook = async (req, res) => {
  try {

    const { bookId } = req.params
    await Book.findByIdAndDelete(bookId);

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




