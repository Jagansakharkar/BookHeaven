const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  bookid: {
    type: mongoose.Types.ObjectId,
    ref: 'books',
    required: true
  },
  userid: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.rating || mongoose.model('rating', ratingSchema);
