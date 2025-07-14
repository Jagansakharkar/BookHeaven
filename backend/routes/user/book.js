const router = require("express").Router();
const User = require("../../models/user");
const Book = require("../../models/books");
const { authenticateToken } = require("../../controller/useAuth");

// Get all books route (without filters, just returns all)

router.get("/get-all-books", async (req, res) => {
  try {
    
    const page=parseInt(req.query.page)||1
    const limit=parseInt(req.query.limit)||8
    const skip=(page-1)*limit
    const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalBooks=await Book.countDocuments()

    books.forEach((book, i) => {
  if (!book.category) {
    console.warn(`Book [${i + 1}] "${book.title}" is missing category`);
  } else {
    console.log(`Book [${i + 1}] "${book.title}" → Category: ${book.category}`);
  }
});
    return res.status(200).json({ status: "Success", 
      data:
       {books ,
        currentPage:page,
        totalPages:Math.ceil(totalBooks/limit),
        totalBooks
       }
     });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// Search books route

router.get("/search", async (req, res) => {
  const query = req.query.query;
  try {
    const results = await Book.find({
      title: { $regex: query, $options: "i" },
    });

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Books route with category filtering and sorting

router.get("/books_filter", async (req, res) => {
  try {
    const { categories, sort, min, max } = req.query;
    const filter = {};

    // Category filter
    if (categories) {
      const categoryArray = categories.split(",");
      filter.category = { $in: categoryArray };
    }

    // Price filter
    if (min !== undefined && max !== undefined) {
      filter.price = {
        $gte: Number(min),
        $lte: Number(max),
      };
    }

    // Sorting
    let sortOption = {};
    if (sort === "lowToHigh") sortOption = { price: 1 };
    else if (sort === "highToLow") sortOption = { price: -1 };

    const books = await Book.find(filter).sort(sortOption);
    res.json({ success: true, data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/get-book-by-id/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const book = await Book.findById(bookid);

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

module.exports = router;
