const express = require('express')
const router = express.Router()
const { authenticationToken }= require('../../middleware/useAuth')
const { getAllBooks, bookFilter, getBookById, search } = require('../../controllers/user/bookControllers')

//get all books
router.get('/',getAllBooks)
//search books
router.get('/search',search)
// filter books
router.get('/books_filter',bookFilter)
// book by id
router.get('/:bookId',getBookById)

module.exports = router 