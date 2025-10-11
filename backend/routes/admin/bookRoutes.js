const express = require('express')
const router = express.Router()
const { authenticationToken} = require('../../middleware/useAuth')
const { getAllBooks, addBook, updatedBook, deleteBook, bookSearch } = require('../../controllers/admin/bookControllers')

//get all books
router.get('/',  authenticationToken, getAllBooks)
// add book
router.post('/add',  authenticationToken, addBook)
// update book
router.put('/:bookId',  authenticationToken, updatedBook)
// delete book
router.delete('/:bookId',  authenticationToken, deleteBook)
// search book
router.get('/search',  authenticationToken, bookSearch)


module.exports=router