const express = require('express');
const router = express.Router();
const Book = require('../../models/books');

// GET /api/admin/inventory/summary
router.get('/summary', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const lowStock = await Book.countDocuments({ stock: { $lt: 5 } });
    const bookCategories = await Book.distinct("category");

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        lowStock,
        bookCategories: bookCategories.length
      }
    });
  } catch (error) {
    console.error("Inventory summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching inventory summary"
    });
  }
});

module.exports = router;
