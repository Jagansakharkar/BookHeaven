import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import { Loader } from '../../Components/common/Loader';
import { Reviews } from '../../Components/User/Reviews';
import { BackButton } from '../../Components/common/BackButton';

// Icons
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { FaCartShopping } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiReturnArrow } from "react-icons/gi";

export const ViewBookDetails = () => {
  const { bookid } = useParams();
  const navigate = useNavigate();
  const { userid, token, isLoggedIn, role } = useSelector(state => state.auth);

  const [book, setBook] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = {
    userid,
    authorization: `Bearer ${token}`
  };

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/books/get-book-by-id/${bookid}`,
          { headers }
        );
        setBook(res.data.data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed to load book details.",
          confirmButtonColor: '#3b82f6'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookid]);

  // Handle Add/Remove Favorite
  const handleFavorite = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/favourite/add-book-to-favourite`,
        { bookid },
        { headers }
      );
      Swal.fire({
        icon: res.data.success ? "success" : "error",
        text: res.data.message,
        confirmButtonColor: '#3b82f6'
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/cart/add-to-cart`,
        { bookid, price: book.price },
        { headers }
      );
      Swal.fire({
        icon: res.data.success ? "success" : "error",
        text: res.data.message,
        confirmButtonColor: '#3b82f6',
        showCancelButton: res.data.success,
        confirmButtonText: "Go to Cart",
        cancelButtonText: "Continue Shopping"
      }).then(result => {
        if (result.isConfirmed) navigate("/cart");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response?.data?.message || "Failed to add to cart",
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  // Handle Delete Book (Admin)
  const handleDeleteBook = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this book?",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it"
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(
          `http://localhost:3000/api/admin/delete-book/${bookid}`,
          { headers }
        );
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: res.data.message,
          confirmButtonColor: '#3b82f6'
        });
        navigate("/all-books");
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to delete book",
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  // Loading or Book not found states
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-900">
        <Loader />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold mb-4">Book not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <IoMdArrowRoundBack /> Go back
        </button>
      </div>
    );
  }



  return (
    <div className="bg-zinc-900 min-h-screen px-4 py-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <BackButton to={-1} text='Back' />

        {/* Book Details Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
            <img
              src={book.url}
              alt={book.title}
              className="h-[60vh] w-full object-contain rounded-lg"
            />
          </div>

          {/* Book Info */}
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-blue-400 text-lg mb-4">by {book.author}</p>
              <p className="text-zinc-300 mb-4">{book.desc}</p>

              <p className="text-zinc-400 text-sm mb-2">
                <span className="font-bold">Category:</span> {book.category || "Unknown"}
              </p>

              <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <GrLanguage /> {book.language}
              </div>

              <div className="text-2xl font-semibold text-white mb-4">₹{book.price}</div>

              <div className="mb-4 space-y-1">
                <p className="font-semibold">Publisher: {book.publisher || "Unknown"}</p>
                <p className="font-semibold">Publish Date: {new Date(book.publishedDate).getFullYear() || "Unknown"}</p>
                <p className="font-semibold">Pages: {book.pages}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <CiDeliveryTruck className="text-xl" /> 4-day delivery
                <GiReturnArrow className="text-xl" /> 6-day return
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isLoggedIn && role === 'user' && (
                <>
                  <button
                    disabled={book.stock === 0}
                    onClick={handleFavorite}
                    className="flex items-center justify-center gap-2 bg-white text-red-500 hover:bg-gray-100 px-4 py-2 rounded-full w-full sm:w-auto"
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
                  </button>

                  <button
                    disabled={book.stock === 0}
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full w-full sm:w-auto"
                  >
                    <FaCartShopping /> Add to Cart
                  </button>
                </>
              )}

              {isLoggedIn && role === 'admin' && (
                <>
                  <Link
                    to={`/updateBook/${bookid}`}
                    className="flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-full w-full sm:w-auto"
                  >
                    <FaEdit /> Edit
                  </Link>

                  <button
                    onClick={handleDeleteBook}
                    className="flex items-center justify-center gap-2 bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded-full w-full sm:w-auto"
                  >
                    <MdDeleteOutline /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-zinc-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <Reviews bookid={bookid} userid={userid} />
        </div>
      </div>
    </div>
  );
};
