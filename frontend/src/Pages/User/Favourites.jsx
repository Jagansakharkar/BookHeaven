import React from 'react';
import Swal from 'sweetalert2';
import BookCard from '../../Components/common/BookCard';
import { useFavouriteBooks } from '../../hooks/Favourites';

const Favourites = () => {
  const { data, isLoading, isError, error } = useFavouriteBooks();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-2xl text-zinc-500">Loading favourites...</p>
      </div>
    );
  }

  if (isError) {
    Swal.fire({
      icon: 'error',
      text: error?.message || 'Something went wrong'
    });
    return null;
  }

  const favouriteBooks = data || [];

  return (
    <>
      {favouriteBooks.length === 0 ? (
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-4xl text-zinc-500">
            Currently No Favourite Book
          </p>
        </div>
      ) : (
        <div className="ms-2 grid grid-cols-4 gap-4">
          {favouriteBooks.map((item, i) => (
            <div key={i}>
              <BookCard data={item} favourites={true} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Favourites;
