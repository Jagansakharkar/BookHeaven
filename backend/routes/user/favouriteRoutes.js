const express = require('express')
const router = express.Router()
const { authenticationToken} = require('../../middleware/useAuth')
const { getFavouriteBooks, addBookToFavourite, removeFromFavourite } = require('../../controllers/user/favouriteControllers')

// add book to favourite
router.put('/add',  authenticationToken, addBookToFavourite)
//remove book
router.put('/:bookId',  authenticationToken, removeFromFavourite)
// get all favourite books
router.get('/',  authenticationToken, getFavouriteBooks)

module.exports = router;