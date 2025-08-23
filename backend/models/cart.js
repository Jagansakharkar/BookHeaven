const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  books: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      priceAtAdded: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.cart || mongoose.model('cart', cartSchema);