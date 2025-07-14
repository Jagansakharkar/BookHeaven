const express = require('express');
const router = express.Router();
const { getOverview, getOrdersPerDay, getRevenuePerDay, getTopBooks, getBooksByCategory } = require('../../controllers/admin/analyticsControllers');

router.get('/overview', getOverview);
router.get('/orders-per-day', getOrdersPerDay);
router.get('/revenue-per-day', getRevenuePerDay);
router.get('/top-books', getTopBooks);
router.get('/books-by-category', getBooksByCategory);

module.exports = router;
