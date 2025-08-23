import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams, Link } from 'react-router-dom';

// Components
import Loader from '../../Components/common/Loader';
import { Reviews } from '../../Components/User/Reviews';
import BackButton from '../../Components/common/BackButton';

// Icons
import { FaEdit, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { useBookById, useDeleteBook } from '../../hooks/Book';
import { useAddFavouriteBook } from '../../hooks/Favourites';
import { useAddToCart } from '../../hooks/Cart';
import { useSelector } from 'react-redux';

const BookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate();

  // Proper use of hooks
  const { data: book, isLoading, error } = useBookById(bookId);
  const { mutate: deleteBook } = useDeleteBook();
  const { mutate: addToFavourite, data: favoriteData } = useAddFavouriteBook();
  const { mutate: addToCart } = useAddToCart();

  const { role, isLoggedIn, userId } = useSelector(state => state.auth)

  // Derived state for favorite status
  const isFavorite = favoriteData?.isFavorite || false;

  const handleFavorite = async () => {
    addToFavourite(bookId, {
      onSuccess: () => {
        // State will update automatically through React Query
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          text: error.response?.data?.message || "Failed to update favorite status",
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  };

  const handleAddToCart = async () => {
    if (!book) return;

    addToCart({ bookId, price: book.price }, {
      onSuccess: (response) => {
        Swal.fire({
          icon: "success",
          text: response.message,
          confirmButtonColor: '#3b82f6',
          showCancelButton: true,
          confirmButtonText: "Go to Cart",
          cancelButtonText: "Continue Shopping"
        }).then(result => {
          if (result.isConfirmed) navigate("/cart");
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          text: error.response?.data?.message || "Failed to add to cart",
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  };

  const handleDeleteBook = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this book?",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete"
    });

    if (confirm.isConfirmed) {
      deleteBook(bookId, {
        onSuccess: (response) => {
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: response.message,
            confirmButtonColor: '#3b82f6'
          });
          navigate("/all-books");
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete book",
            confirmButtonColor: '#3b82f6'
          });
        }
      });
    }
  };

  if (isLoading) return <Loader />;
  // if (error) return <ErrorPage error={error} />;
  // if (!book) return <NotFound />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Book not found</h2>

        <BackButton to={-1} text="Go back" />

      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <BackButton to={-1} text='Back' />

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          {/* Book Image */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
            <img
              src={book.url}
              alt={book.title}
              className="h-[500px] w-full object-contain rounded-lg"
            />
          </div>

          {/* Book Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-blue-600 text-lg mb-4">by {book.author}</p>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-semibold text-gray-900">₹{book.price}</span>
                  {book.stock > 0 ? (
                    <span className="ml-2 text-sm text-green-600">In Stock</span>
                  ) : (
                    <span className="ml-2 text-sm text-red-600">Out of Stock</span>
                  )}
                </div>
                <div className="flex items-center text-yellow-400">
                  {/* Star rating component would go here */}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{book.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Publisher</p>
                  <p className="font-medium">{book.publisher || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="font-medium">{new Date(book.publishedDate).getFullYear() || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                <CiDeliveryTruck className="text-lg" />
                <span>Free delivery on orders over ₹500</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {isLoggedIn && role === 'user' && (
                <>
                  <button
                    disabled={book.stock === 0}
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${book.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={handleFavorite}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </>
              )}

              {isLoggedIn && role === 'admin' && (
                <div className="flex space-x-3">
                  <Link
                    to={`/updateBook/${bookId}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    <FaEdit /> Edit Book
                  </Link>
                  <button
                    onClick={handleDeleteBook}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    <MdDeleteOutline /> Delete Book
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <Reviews bookId={bookId} userId={userId} />
        </div>
      </div>
    </div>
  );
};
export default BookDetails