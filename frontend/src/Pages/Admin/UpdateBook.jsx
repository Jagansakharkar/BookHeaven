import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBook, FaUserEdit, FaImage, FaLanguage, FaDollarSign, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

// Components
import BackButton from '../../Components/common/BackButton';
import { InputField } from '../../Components/common/InputField';
import { TextAreaField } from '../../Components/common/TextAreaField';
import { useBookById, useUpdateBook } from '../../hooks/Book';
import Loader from '../../Components/common/Loader';

const UpdateBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const { mutate: bookById, isLoading } = useBookById()
  // const { mutate: updateBook, isLoading: isUpdateLoading } = useUpdateBook()
const updateBookMutation=useUpdateBook()
  const [Data, setData] = useState({
    url: '',
    title: '',
    author: '',
    price: '',
    desc: '',
    language: '',
  });


  // Fetch book data by ID on load
  useEffect(() => {
    const fetchBook = async () => {
      try {

        bookByIdMutation.mutate(bookId, {
          onSuccess: (response) => {
            const book = response.data
            setData({
              url: book.url || '',
              title: book.title || '',
              author: book.author || '',
              price: book.price?.toString() || '',
              desc: book.desc || '',
              language: book.language || '',
            });
          },
          onError: (response) => {
            Swal.fire({
              icon: 'error',
              text: 'Error fetching book data',
              background: '#18181b',
              color: '#fff',
              confirmButtonColor: '#3b82f6'
            });
          }
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          text: 'Error: ' + error.message,
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
      }

      fetchBook();
    }
  }, [bookId]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const { url, title, author, price, desc, language } = Data;

    if (!url || !title || !author || !price || !desc || !language) {
      Swal.fire({
        icon: 'warning',
        text: 'All fields are required',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      updateBookMutation.mutate(bookId, Data, {
        onSuccess: (response) => {
          Swal.fire({
            icon: 'success',
            text: res.data.message,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
          setTimeout(() => navigate('/all-books'), 2000);
        }
      })

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: 'Something went wrong',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };
  if (isLoading && !Data.title) {
    return (
   <Loader/>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <BackButton to={-1} text='Back to Dashboard' />


        <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex items-center gap-3">
              <FaBook className="text-2xl text-white" />
              <h1 className="text-2xl font-bold text-white">Update Book</h1>
            </div>
            <p className="text-blue-100 mt-1">Edit the book details below</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="p-6 space-y-6">
            {/* Image URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="text-zinc-400" />
                </div>
                <input
                  type="text"
                  name="url"
                  value={Data.url}
                  onChange={change}
                  placeholder="https://example.com/book-cover.jpg"
                  className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBook className="text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={Data.title}
                    onChange={change}
                    placeholder="Book Title"
                    className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Author</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserEdit className="text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="author"
                    value={Data.author}
                    onChange={change}
                    placeholder="Author Name"
                    className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Language & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Language</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLanguage className="text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="language"
                    value={Data.language}
                    onChange={change}
                    placeholder="English"
                    className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={Data.price}
                    onChange={change}
                    placeholder="0.00"
                    className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Description</label>
              <textarea
                name="desc"
                value={Data.desc}
                onChange={change}
                placeholder="Enter book description..."
                rows={5}
                className="w-full px-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/view-book-details/${bookId}`)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-600 hover:bg-zinc-500 text-white rounded-lg transition-colors"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateBookMutation.isPending}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${loading
                  ? 'bg-blue-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
              >
                {updateBookMutation.isPending? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdateBook;