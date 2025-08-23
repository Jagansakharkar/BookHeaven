import React from 'react'
import  BookCard  from "../../common/BookCard"
import  Loader  from '../../common/Loader'
import { useSelector } from 'react-redux'
import { fetchBooks } from '../../../store/books/authBooks'

export const RecentlyAdded = () => {
  const { books, loading } = useSelector(state => state.books)

  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)

  return (
    <div className='mt-8 px-4'>
      <h4 className='text-3xl text-yellow-100'>Recently Added Books</h4>

      {loading ? (
        <div className='flex items-center justify-center my-8'>
          <Loader />
        </div>
      ) : (
        <div className='my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {recentBooks.map((item, i) => (
            <div key={i}>
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
