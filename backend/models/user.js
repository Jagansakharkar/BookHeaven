const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/ // basic email validation
  },
  password: {
    type: String,
    required: true
  },
  address: {
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/
    }
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books"
    }
  ],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart"
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order"
    }
  ]
}, {
  timestamps: true
});


module.exports = mongoose.models.user || mongoose.model('user', userSchema);