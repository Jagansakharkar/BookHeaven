const User = require("../../models/user");


// Add book to favourite
exports.addBookToFavourite = async (req, res) => {
  try {

    const { bookId,userId } = req.params
    const userData = await User.findById(userId);
    const isBookFavourite = userData.favourites.includes(bookId);
    if (isBookFavourite) {
      return res.status(200).json({ success: true, message: 'Book is already in favourites' });
    }
    await User.findByIdAndUpdate(userId, { $push: { favourites: bookid } });
    return res.status(200).json({ success: true, message: "Book added to favourites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Remove book from favourite

exports.removeFromFavourite = async (req, res) => {
  try {
    const { bookId,userId } = req.params;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isBookFavourite = userData.favourites.includes(bookId);
    if (isBookFavourite) {
      await User.findByIdAndUpdate(userId, {
        $pull: { favourites: bookId },
      });
      return res
        .status(200)
        .json({ success: true, message: "Book removed from favourites" });
    }

    return res
      .status(200)
      .json({ success: false, message: "Book is not in favourites" });
  } catch (error) {
    console.error("Error removing from favourites:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// Get favourite books
exports.getFavouriteBooks = async (req, res) => {
  try {
    const {userId} = req.params
    const userData = await User.findById(userId).populate("favourites");
    const favouriteBooks = userData.favourites;

    return res.json({
      success: true,
      data: favouriteBooks
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
}


