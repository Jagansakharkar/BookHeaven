import React from 'react'
import { useSelector } from 'react-redux'
import { BackButton } from '../../Components/common/BackButton';

import { useNavigate } from 'react-router-dom';

export const AdminNotification = () => {
  const { lowStockBooks, outofStockBooks } = useSelector(state => state.bookAlert); // ✅ reducer key should match store
  const navigate = useNavigate()
  return (
    <div className="p-4">
      <BackButton to={-1} text='Back' />

      <h2 className="text-xl font-bold mb-2">Low Stock Books</h2>
      {lowStockBooks.map(book => (
        <div key={book._id} className="mb-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800">
          <p>
            <strong>{book._id} {book.title}</strong> only <strong>{book.stock}</strong> left in stock.
          </p>
        </div>
      ))}

      <hr className="my-4" />

      <h2 className="text-xl font-bold mb-2">Out of Stock Books</h2>
      {outofStockBooks ? outofStockBooks.map(book => (
        <div key={book._id} className="mb-2 p-2 bg-red-100 border-l-4 border-red-500 text-red-800">
          <p>
            <strong>{book._id} {book.title}</strong> is currently out of stock.
          </p>
        </div>
      )) : <p>No Any Book Out of Stock</p>}
    </div>
  )
}
