const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  books: [
    {
      bookid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      title: {
        type: String
      },
      desc: {
        type: String
      },
      author: {
        type: String
      },
      category:{
        type:String
      }
    }
  ]
}, { timestamps: true });


module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);