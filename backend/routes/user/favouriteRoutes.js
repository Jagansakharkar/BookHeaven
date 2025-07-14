const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { getFavouriteBooks, addBookToFavourite, removeFromFavourite } = require('../../controllers/user/favouriteControllers')

router.put('/add-book-to-favourite', authenticateToken, addBookToFavourite)
router.put('/remove-from-favourite', authenticateToken, removeFromFavourite)
router.get('/get-favourite-books', authenticateToken, getFavouriteBooks)

module.exports = router;