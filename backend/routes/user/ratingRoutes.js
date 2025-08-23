const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { rateBook, ratingSummary, getRatings ,deleteReview,updateReview} = require('../../controllers/user/ratingControllers')

router.get('/:bookId', authenticateToken, getRatings)
router.post('/rate-book/:bookId', authenticateToken, rateBook)
router.get('/summary/:bookId', authenticateToken, ratingSummary)
router.put('/update-review/:userId/:reviewId', authenticateToken, updateReview);
router.delete('/delete-review/:reviewId', authenticateToken, deleteReview);


module.exports = router;