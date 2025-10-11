import React from 'react';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useAddFavouriteBook, useRemoveFromFravourite } from '../../hooks/Favourites';
import { useSelector } from 'react-redux';

const BookCard = ({ data, favourites }) => {
  const { isLoggedIn } = useSelector(state => state.auth)
  const bookId = data._id;
  // const { mutate: removeFromFavourite, isLoading: isRemoveFavouriteLoading, isError: isRemoveFavouriteError, error: removeFavouriteError }
  //   = useRemoveFromFravourite()
  const removeFromFavouriteMutation = useRemoveFromFravourite()
  // const { mutate: addToFavourite, isLoading: isAddFavouriteLoading, isError: isAddFavouriteError, error: addFavouriteError }
  // = useAddFavouriteBook()
  const addToFavouriteMutation = useAddFavouriteBook()
  const handleRemoveBook = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Remove from Favorites?',
      text: "Are you sure you want to remove this book?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        removeFromFavouriteMutation.mutate(bookId, {
          onSuccess: (response) => {
            Swal.fire({
              icon: response.success ? 'success' : 'error',
              title: response.success ? 'Removed!' : 'Error',
              text: response.message,
              timer: 1500
            });
          },
          onError: (response) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
  };
  const handleAddToFavourites = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToFavouriteMutation.mutate(bookId,
        {
          onSuccess: (response) => {
            Swal.fire({
              icon: response.success ? 'success' : 'error',
              title: response.success ? 'Added!' : 'Error',
              text: response.message,
              timer: 1500
            });
          },
          onError: (response) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        }
      )
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };


  const Wrapper = ({ children }) =>
    isLoggedIn ? (
      <Link to={`/view-book-details/${data._id}`} className="block h-full">
        {children}
      </Link>
    ) : (
      <Link to='/login' className="block h-full">
        {children}
      </Link>
    );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <Wrapper>
        <div className="relative">
          <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
            <img
              src={data.url}
              alt={data.title}
              className="h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Stock status badge */}
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full
            ${data.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {data.stock < 10 ? 'Limited Stock' : 'In Stock'}
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-gray-900 font-bold text-lg mb-1 line-clamp-2" title={data.title}>
            {data.title}
          </h2>
          <p className="text-gray-600 text-sm mb-2">by {data.author}</p>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-indigo-600 font-bold text-lg">
                ₹{typeof data.price === 'number' ? data.price.toLocaleString() : 'N/A'}
              </p>
              {data.category && (
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
                  {data.category.name}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to cart functionality here
                }}
              >
                <FiShoppingCart size={18} />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  handleAddToFavourites
                }}
              >
                <FiHeart size={18} />
              </button>
            </div>
          </div>
        </div>
      </Wrapper>

      {favourites && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleRemoveBook}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <FiTrash2 size={16} />
            {removeFromFavouriteMutation.isPending ? 'Removing' : 'Remove from Favorites'}

          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard