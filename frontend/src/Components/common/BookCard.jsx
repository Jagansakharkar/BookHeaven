import React from 'react';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import axios from 'axios';

export const BookCard = ({ data, favourites }) => {
  const { userid, token, isLoggedIn } = useSelector(state => state.auth);
  const bookid = data._id;

  const headers = {
    userid: userid,
    authorization: `Bearer ${token}`,
  };

  const handleRemoveBook = async () => {
    try {
      const response = await axios.put(
        'http://localhost:3000/api/favourite/remove-from-favourite',
        { bookid },
        { headers }
      );

      Swal.fire({
        icon: response.data.success ? 'success' : 'error',
        text: response.data.message
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: 'Something went wrong!',
      });
      console.error("Error Occurred", error);
    }
  };

  const Wrapper = ({ children }) =>
    isLoggedIn ? (
      <Link to={`/view-book-details/${data._id}`}>{children}</Link>
    ) : (
      <Link to='/login'>{children}</Link>
    );

  return (
    <>
      <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg hover:scale-[1.03] transition duration-300 min-h-[350px]">
        <Wrapper>
          <div className="h-[220px] bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={data.url}
              alt={data.title}
              className="h-full w-auto object-contain"
            />
          </div>

          <div className="mt-4 space-y-1">
            <h2 className="text-white text-lg font-bold truncate">{data.title}</h2>
            <p className="text-zinc-400 text-sm">by {data.author}</p>
            <p className="text-zinc-400 text-sm">
              <span className="font-semibold">Category:</span>{" "}
              {data.category || "Unknown"}
            </p>
            <p className="text-yellow-400 font-bold text-lg">₹{data.price}</p>

            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2
              ${data.stock < 10
                  ? 'bg-red-500 text-white'
                  : 'bg-green-600 text-white'
                }`}
            >
              {data.stock < 10 ? 'Few Left' : 'In Stock'}
            </span>

            <p className="text-zinc-500 text-xs">
              <span className="font-semibold">Updated:</span>{" "}
              {new Date(data.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </Wrapper>

        {favourites && (
          <button
            onClick={handleRemoveBook}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white transition px-4 py-2 rounded text-sm font-medium"
          >
            Remove from Favourites
          </button>
        )}

      </div>
    </>
  );
};
