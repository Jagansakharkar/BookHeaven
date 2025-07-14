import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { BackButton } from '../../Components/common/BackButton';

import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../../store/books/authBooks';
import { setPage } from '../../store/books/booksSlice';

export const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, currentPage, totalPages } = useSelector(state => state.book);

  const { userid, token } = useSelector(state => state.auth);

  const [search, setSearch] = useState('');
  const [inventorySummary, setInventorySummary] = useState({
    totalBooks: 0,
    bookCategories: 0,
    lowStock: 0,
  });

  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    dispatch(fetchBooks({ page: currentPage, limit: 8 }));
  }, [dispatch, currentPage]);

  const fetchInventorySummary = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/inventory/summary', { headers });
      setInventorySummary(res.data.data);
    } catch (error) {
      Swal.fire({ icon: 'error', text: 'Failed to fetch inventory summary' });
    }
  };

  useEffect(() => {
    fetchInventorySummary();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      dispatch(fetchBooks({ page: 1, limit: 8 }));
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3000/api/admin/books/book/search?title=${search}`, { headers });
      dispatch({ type: 'book/setBooks', payload: { books: res.data.data, pagination: { currentPage: 1, totalPages: 1 } } });
    } catch (error) {
      Swal.fire({ icon: 'error', text: 'Failed to search books' });
    }
  };

  const handlebookEdit = (bookid) => {
    navigate(`/admin/dashboard/edit-book/${bookid}`);
  };

  const handlebookDelete = async (bookid) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This book will be permanently deleted!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:3000/api/admin/books/delete-book/${bookid}`, { headers });
        if (res.data.success) {
          Swal.fire('Deleted!', res.data.message, 'success');
          dispatch(removeBook(bookid));

          if (books.length === 1 && currentPage > 1) {
            dispatch(setPage(currentPage - 1));
            dispatch(fetchBooks({ page: currentPage - 1, limit: 8 }));
          } else {
            dispatch(fetchBooks({ page: currentPage, limit: 8 }));
          }
        } else {
          Swal.fire('Error', res.data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete book', 'error');
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
    <div className="h-full p-6 text-zinc-100 bg-zinc-950">
   
            <BackButton to={"/admin/dashboard"} text='Back' />

      

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center text-white">
        <div className="bg-blue-700 rounded-xl shadow-md p-4">
          <div className="text-xl font-bold">📚 Total Books</div>
          <div className="text-3xl">{inventorySummary.totalBooks}</div>
        </div>
        <div className="bg-green-700 rounded-xl shadow-md p-4">
          <div className="text-xl font-bold">📂 Total Categories</div>
          <div className="text-3xl">{inventorySummary.bookCategories}</div>
        </div>
        <div className="bg-red-700 rounded-xl shadow-md p-4">
          <div className="text-xl font-bold">⚠️ Low Stock</div>
          <div className="text-3xl">{inventorySummary.lowStock}</div>
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-zinc-300 mb-6">All Books</h1>

      <div className="mb-6 bg-zinc-900 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search book by title..."
            className="px-4 py-2 rounded-md bg-zinc-800 text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-all"
            onClick={handleSearch}
          >
            <CiSearch size={20} />
            <span className="hidden sm:inline">Search</span>
          </button>

          {search.trim() && (
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-all"
              onClick={() => {
                setSearch('');
                dispatch(fetchBooks({ page: 1, limit: 8 }));
              }}
            >
              Show All
            </button>
          )}
        </div>

        <div className="flex-shrink-0 flex gap-2">
          <Link to="/admin/dashboard/add-categories">
            <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md text-white transition-all">
              + Add Categories
            </button>
          </Link>
          <Link to="/admin/dashboard/add-book">
            <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md text-white transition-all">
              + Add Book
            </button>
          </Link>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-scroll border border-zinc-700 rounded">
        <table className="min-w-full bg-zinc-800 text-white">
          <thead className="sticky top-0 bg-zinc-900 z-index-10">
            <tr className="text-center">
              <th className="p-2">Sr.</th>
              <th className="p-2">BookID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Added On</th>
              <th className="p-2">Category</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Price</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? books.map((item, index) => (
              <tr key={item._id} className="text-center hover:bg-zinc-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item._id}</td>
                <td className="p-2">{item.title}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="p-2">{item.category?.name || item.category || 'N/A'}</td>
                <td className="p-2">{item.stock}</td>
                <td className="p-2">₹{item.price.toLocaleString('en-IN')}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline mr-2" onClick={() => handlebookEdit(item._id)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:underline" onClick={() => handlebookDelete(item._id)}>
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center text-red-400 py-4">No books found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-5 py-2 rounded-full font-semibold bg-yellow-500 text-black hover:bg-yellow-600 transition disabled:bg-gray-500"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-xl font-medium">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-5 py-2 rounded-full font-semibold bg-yellow-500 text-black hover:bg-yellow-600 transition disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};
