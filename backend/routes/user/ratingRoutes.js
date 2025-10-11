const express = require('express')
const router = express.Router()
const { authenticationToken} = require('../../middleware/useAuth')
const { rateBook, ratingSummary, getRatings ,deleteReview,updateReview} = require('../../controllers/user/ratingControllers')

router.get('/:bookId',  authenticationToken, getRatings)
router.post('/rate-book/:bookId',  authenticationToken, rateBook)
router.get('/summary/:bookId',  authenticationToken, ratingSummary)
router.put('/update-review/:reviewId',  authenticationToken, updateReview);
router.delete('/delete-review/:reviewId',  authenticationToken, deleteReview);


module.exports = router;