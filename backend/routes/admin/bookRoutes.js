const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { getAllBooks, addBook, updatedBook, deleteBook, bookSearch } = require('../../controllers/admin/bookControllers')

router.get('/get-all-books', authenticateToken, getAllBooks)
router.post('/add-book', authenticateToken, addBook)
router.put('/update-book/:bookid', authenticateToken, updatedBook)
router.delete('/delete-book/:book', authenticateToken, deleteBook)
router.get('/book/search', authenticateToken, bookSearch)


module.exports=router