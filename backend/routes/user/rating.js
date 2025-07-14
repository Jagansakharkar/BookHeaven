const { authenticateToken } = require("../../controller/useAuth");
const router = require('express').Router()
const Rating = require('../../models/rating')

//rate book
router.post('/rate-book/:bookid', authenticateToken, async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const userid = req.user.id;
    const bookid = req.params.bookid

    //check if user already rated this book
    const existing = await Rating.findOne({ user_id: userid, book_id: bookid })

    if (existing) {
      existing.rating = rating
      existing.comment = comment
      await existing.save()
      return res.status(200).json({ success: true, message: "Rating Updated" })
    }

    const newRating = new Rating({ book_id: bookid, user_id: userid, rating, comment })
    await newRating.save()
    res.status(200).json({ success: true, message: "Rated Successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to Submit the Rating" })
  }
})

router.get('/get-ratings/:bookid', async (req, res) => {
  try {
    const bookid = req.params.bookid
    const ratings = await Rating.find({ book_id: bookid })
      .populate('user_id', "fullname avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: ratings })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" })
  }
})

// Get rating summary
router.get('/rating-summary/:bookid', async (req, res) => {
  try {
    const bookid = req.params.bookid;

    const ratings = await Rating.find({ book_id: bookid });

    let total = ratings.length;
    let sum = 0;
    let breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratings.forEach(r => {
      sum += r.rating;
      breakdown[r.rating]++;
    });

    let average = total > 0 ? (sum / total).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        average: Number(average),
        total,
        breakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get summary" });
  }
});

module.exports = router