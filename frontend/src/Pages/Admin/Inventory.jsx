import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaBoxOpen, FaBook, FaExclamationTriangle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import BackButton from '../../Components/common/BackButton';
import { CiSearch, CiFilter } from "react-icons/ci";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../../store/books/authBooks';
import { setPage } from '../../store/books/booksSlice';
import { FiRefreshCw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useInventorySummary } from '../../hooks/Inventory';
import { useDeleteBook } from '../../hooks/Book';
import { useFetchOrders } from '../../hooks/Order';
import Loader from '../../Components/common/Loader';

const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, currentPage, totalPages, isLoading } = useSelector(state => state.book);

  if (isLoading) {
    return <Loader />
  }
  const [search, setSearch] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [inventorySummary, setInventorySummary] = useState({
    totalBooks: 0,
    bookCategories: 0,
    lowStock: 0,
  });

  useEffect(() => {
    dispatch(fetchBooks({ page: currentPage, limit: 8 }));
  }, [dispatch, currentPage]);

  const { data: getInventorySummary, isLoading: isInventorySummaryLoading } = useInventorySummary()
  // const { mutate: deleteBook, isLoading: isDeleteLoading } = useDeleteBook()

  const deleteBookMutation = useDeleteBook()
  // const fetchInventorySummary = async () => {
  //   try {
  //     getInventorySummary({
  //       onSuccess: (response) => {
  //         setInventorySummary(response.data);
  //       },
  //       onError: (response) => {
  //         Swal.fire({
  //           icon: 'error',
  //           text: 'Failed to fetch inventory summary',
  //           background: '#1f2937',
  //           color: '#fff',
  //           confirmButtonColor: '#3b82f6'
  //         });
  //       }
  //     })
  //   } catch (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       text: 'Failed to fetch inventory summary',
  //       background: '#1f2937',
  //       color: '#fff',
  //       confirmButtonColor: '#3b82f6'
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchInventorySummary();
  // }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      dispatch(fetchBooks({ page: 1, limit: 8 }));
      return;
    }
    try {
      ;
      const res = await axios.get(`http://localhost:3000/api/admin/books/book/search?title=${search}`, { headers });
      dispatch({ type: 'book/setBooks', payload: { books: res.data.data, pagination: { currentPage: 1, totalPages: 1 } } })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: 'Failed to search books',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handlebookEdit = (bookId) => {
    alert(bookId)
    navigate(`/admin/dashboard/edit-book/${bookId}`);
  };

  const handlebookDelete = async (bookId) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This book will be permanently deleted!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280'
    });

    if (confirm.isConfirmed) {
      try {
        deleteBookMutation.mutate(bookId, {
          onSuccess: (response) => {
            Swal.fire({
              title: 'Deleted!',
              text: res.data.message,
              icon: 'success',
              background: '#1f2937',
              color: '#fff',
              confirmButtonColor: '#3b82f6'
            });
            dispatch(removeBook(bookid));

            if (books.length === 1 && currentPage > 1) {
              dispatch(setPage(currentPage - 1));
              dispatch(fetchBooks({ page: currentPage - 1, limit: 8 }));
            } else {
              dispatch(fetchBooks({ page: currentPage, limit: 8 }));
            }
          },
          onError: (response) => {
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              background: '#1f2937',
              color: '#fff',
              confirmButtonColor: '#3b82f6'
            });
          }
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete book',
          icon: 'error',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) dispatch(setPage(currentPage - 1));
  };

  const handleNext = () => {
    if (currentPage < totalPages) dispatch(setPage(currentPage + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 md:p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BackButton to={"/admin/dashboard"} text='Back to Dashboard' />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory Management</h1>
          </div>

          <div className="flex gap-2">
            <Link to="/admin/dashboard/add-categories">
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition-colors">
                <FaBook />
                <span>Add Categories</span>
              </button>
            </Link>
            <Link to="/admin/dashboard/add-book">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                <FaBoxOpen />
                <span>Add Book</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-600 dark:bg-blue-700 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Total Books</div>
                <div className="text-3xl font-bold">{inventorySummary.totalBooks}</div>
              </div>
              <FaBook className="text-4xl opacity-50" />
            </div>
          </div>
          <div className="bg-green-600 dark:bg-green-700 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Total Categories</div>
                <div className="text-3xl font-bold">{inventorySummary.bookCategories}</div>
              </div>
              <FaBoxOpen className="text-4xl opacity-50" />
            </div>
          </div>
          <div className="bg-red-600 dark:bg-red-700 rounded-xl shadow-md p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Low Stock</div>
                <div className="text-3xl font-bold">{inventorySummary.lowStock}</div>
              </div>
              <FaExclamationTriangle className="text-4xl opacity-50" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Books
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiSearch className="text-gray-400" size={20} />
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title, author, ISBN..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {/* {isLoading ? <FiRefreshCw className="animate-spin" /> : <CiSearch />} */}
                <span className="hidden sm:inline">Search</span>
              </button>
              <button
                onClick={() => {
                  setSearch('');
                  dispatch(fetchBooks({ page: 1, limit: 8 }));
                }}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiRefreshCw />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 border border-zinc-800">
              <thead className="bg-gray-50 dark:bg-zinc-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Added On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <FiRefreshCw className="animate-spin text-blue-500" size={24} />
                      </div>
                    </td>
                  </tr>
                ) : books.length > 0 ? books.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item._id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.category?.name || item.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.stock > 10
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.stock > 0
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {item.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handlebookEdit(item._id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handlebookDelete(item._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <MdDeleteOutline size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              <FiChevronLeft />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Inventory;