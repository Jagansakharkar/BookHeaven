import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BookCard } from '../../Components/common/BookCard';
import { useSelector } from 'react-redux';

export const Favourites = () => {
  const [FavouriteBook, setFavouriteBook] = useState([]);
  const { userid, token } = useSelector(state => state.auth)

  const headers = {
    userid: userid,
    authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/favourite/get-favourite-books', { headers });
        setFavouriteBook(response.data.data);
      } catch (error) {
        console.error("Error fetching favourite books:", error);
      }
    };
    fetchBooks();
  }, [FavouriteBook]);

  return (
    <>
      {FavouriteBook && FavouriteBook.length === 0 ? (
        <div className='w-full h-screen flex justify-center items-center '>
          <p className='text-4xl text-zinc-500'>
            Currently No Favourite Book
          </p>
        </div>
      ) : (
        <div className='ms-2 grid grid-cols-4 gap-4'>
          {FavouriteBook.map((item, i) => (
            <div key={i}>
              <BookCard data={item} favourites={true} />
            </div>
          ))}
        </div>
      )}
    </>
  )
};
