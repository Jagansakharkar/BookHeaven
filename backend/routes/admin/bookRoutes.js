const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { getAllBooks, addBook, updatedBook, deleteBook, bookSearch } = require('../../controllers/admin/bookControllers')

//get all books
router.get('/', authenticateToken, getAllBooks)
// add book
router.post('/add', authenticateToken, addBook)
// update book
router.put('/:bookId', authenticateToken, updatedBook)
// delete book
router.delete('/:bookId', authenticateToken, deleteBook)
// search book
router.get('/search', authenticateToken, bookSearch)


module.exports=router