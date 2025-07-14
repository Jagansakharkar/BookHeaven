const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../../middleware/useAuth')
const { rateBook, ratingSummary, getRatings ,deleteReview,updateReview} = require('../../controllers/user/ratingControllers')

router.get('/get-ratings/:bookid', authenticateToken, getRatings)
router.post('/rate-book/:bookid', authenticateToken, rateBook)
router.get('/rating-summary/:bookid', authenticateToken, ratingSummary)
router.put('/update-review/:reviewid', authenticateToken, updateReview);
router.delete('/delete-review/:reviewid', authenticateToken, deleteReview);


module.exports = router;