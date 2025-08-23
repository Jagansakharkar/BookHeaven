
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String, trim: true }],
    isbn: { type: String, unique: true, trim: true },
    language: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    desc: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },

    publisher: { type: String, trim: true },
    publishedDate: { type: Date },
    pages: { type: Number, min: 1 },

    views: { type: Number, default: 0 },

    formats: [
      {
        formatType: { type: String, enum: ["Hardcover", "Paperback", "Ebook"], required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.models.books || mongoose.model('books', bookSchema);
