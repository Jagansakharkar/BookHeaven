const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  books: [
    {
      bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      desc: String,
      author: String,
      title: String
    }
  ],
  totalAmount: { type: Number, required: true },
  address: {
    name:{type:String,required:true},
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneno: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  acceptedDelivery: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
