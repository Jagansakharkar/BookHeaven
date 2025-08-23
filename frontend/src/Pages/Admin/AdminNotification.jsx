import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaTimesCircle, FaBoxOpen, FaArrowLeft } from 'react-icons/fa';
import  BackButton  from '../../Components/common/BackButton';

const AdminNotification = () => {
  const { lowStockBooks, outofStockBooks } = useSelector(state => state.bookAlert);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton to={-1} text='Back to Dashboard<' />

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex items-center gap-3">
              <FaBoxOpen className="text-2xl text-white" />
              <h1 className="text-2xl font-bold text-white">Inventory Alerts</h1>
            </div>
            <p className="text-blue-100 mt-1">Manage your book inventory status</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Low Stock Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FaExclamationTriangle className="text-yellow-500 text-xl" />
                <h2 className="text-xl font-bold text-gray-800">Low Stock Books</h2>
                <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {lowStockBooks.length} items
                </span>
              </div>

              {lowStockBooks.length > 0 ? (
                <div className="space-y-3">
                  {lowStockBooks.map(book => (
                    <div key={book._id} className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors">
                      <div className="bg-yellow-100 p-2 rounded-full mr-4">
                        <FaExclamationTriangle className="text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{book.title}</h3>
                        <p className="text-sm text-gray-600">ID: {book._id}</p>
                        <p className="text-yellow-700 font-medium mt-1">
                          Only {book.stock} left in stock - Reorder soon!
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
                  No low stock books at this time
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Out of Stock Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaTimesCircle className="text-red-500 text-xl" />
                <h2 className="text-xl font-bold text-gray-800">Out of Stock Books</h2>
                <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {outofStockBooks?.length || 0} items
                </span>
              </div>

              {outofStockBooks?.length > 0 ? (
                <div className="space-y-3">
                  {outofStockBooks.map(book => (
                    <div key={book._id} className="flex items-start p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                      <div className="bg-red-100 p-2 rounded-full mr-4">
                        <FaTimesCircle className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{book.title}</h3>
                        <p className="text-sm text-gray-600">ID: {book._id}</p>
                        <p className="text-red-700 font-medium mt-1">
                          Currently out of stock - Urgent restock needed!
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
                  No out of stock books at this time
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminNotification;