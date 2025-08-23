const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'books',
    required: true,
    index: true // Index for faster book-wise queries
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true // Index for user-specific queries
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
    maxlength: 1000, // prevent excessively large text
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can only rate a book once
ratingSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
