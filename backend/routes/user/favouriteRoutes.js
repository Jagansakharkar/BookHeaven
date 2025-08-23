const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { getFavouriteBooks, addBookToFavourite, removeFromFavourite } = require('../../controllers/user/favouriteControllers')

// add book to favourite
router.put('/add', authenticateToken, addBookToFavourite)
//remove book
router.put('/:userId/:bookId', authenticateToken, removeFromFavourite)
// get all favourite books
router.get('/:userId', authenticateToken, getFavouriteBooks)

module.exports = router;