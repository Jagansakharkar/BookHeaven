
const router = require("express").Router();
const User = require("../../models/user");
const Book = require("../../models/books");

// Get all books route (without filters, just returns all)

exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 8
    const skip = (page - 1) * limit
    const books = await Book.find().populate("category").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments()
    return res.status(200).json({
      status: "Success",
      data: {
        books,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks
      }

    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
}

// Search books route

exports.search = async (req, res) => {
  const query = req.query.query;
  try {
    const results = await Book.find({
      title: { $regex: query, $options: "i" },
    });

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
}

// Books route with category filtering and sorting

exports.bookFilter = async (req, res) => {
  try {
    const { categories, sort, min, max, page = 1, limit = 8 } = req.query;
    const filter = {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    //  Category filter by ID
    if (categories) {
      const categoryIds = categories.split(",").map(id => id.trim());
      filter.category = { $in: categoryIds };
    }

    //  Price filter
    if (min !== undefined && max !== undefined) {
      filter.price = {
        $gte: Number(min),
        $lte: Number(max),
      };
    }

    //  Sorting
    let sortOption = {};
    if (sort === "lowToHigh") sortOption = { price: 1 };
    else if (sort === "highToLow") sortOption = { price: -1 };

    //  Get filtered and paginated books
    const books = await Book.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalBooks = await Book.countDocuments(filter);

    res.json({
      success: true,
      data: {
        books,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
      }
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
}


