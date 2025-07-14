const Rating = require('../../models/rating')

//rate book
exports.rateBook = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const userid = req.user.id;
    const bookid = req.params.bookid

    //check if user already rated this book
    const existing = await Rating.findOne({ userid: userid, bookid: bookid })

    if (existing) {
      existing.rating = rating
      existing.comment = comment
      await existing.save()
      return res.status(200).json({ success: true, message: "Rating Updated" })
    }

    const newRating = new Rating({ bookid: bookid, userid: userid, rating, comment })
    await newRating.save()
    res.status(200).json({ success: true, message: "Rated Successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to Submit the Rating" })
  }
}

exports.getRatings = async (req, res) => {
  try {
    const bookid = req.params.bookid
    const ratings = await Rating.find({ bookid: bookid })
      .populate('userid', "fullname avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: ratings })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Occurred" })
  }
}

// Get rating summary
exports.ratingSummary = async (req, res) => {
  try {
    const bookid = req.params.bookid;

    const ratings = await Rating.find({ bookid: bookid });

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
}

// update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewid;
    const userId = req.user.id;

    const review = await Rating.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.userid.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this review" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ success: true, message: "Review updated successfully" });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

// delete review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewid;
    const userId = req.user.id;

    const review = await Rating.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.userid.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }

    await review.remove();

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
