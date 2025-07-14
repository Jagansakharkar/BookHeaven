const express = require('express')
const router = express.Router()
const {authenticateToken }= require('../../middleware/useAuth')
const { getAllBooks, bookFilter, getBookById, search } = require('../../controllers/user/bookControllers')

router.get('/get-all-books', getAllBooks)
router.get('/book/search', authenticateToken, search)
router.get('/books_filter', authenticateToken, bookFilter)
router.get('/get-book-by-id/:bookid', authenticateToken, getBookById)

module.exports = router;