import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/Categories/categoryThunks';
import { FaBook, FaUserEdit, FaImage, FaLanguage, FaDollarSign, FaBoxOpen, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import Loader from '../../Components/common/Loader';

// Reusable components
import { InputField } from '../../Components/common/InputField';
import { TextAreaField } from '../../Components/common/TextAreaField';
import { SelectField } from '../../Components/common/SelectField';
import BackButton from '../../Components/common/BackButton';
import { useAddBook } from '../../hooks/Book';

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories,isLoading } = useSelector((state) => state.categories);
  // const { mutate: addBook, isLoading, isError, error } = useAddBook()
  const addBookMutation = useAddBook()
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    stock: "",
    category: "",
    publisher: "",
    publishedDate: "",
    pages: ""
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  if(isLoading){
    return <Loader/>
  }
  const handleBookSubmit = (e) => {
    e.preventDefault();

    const {
      url, title, author, price, desc,
      language, stock, category, publisher,
      publishedDate, pages
    } = Data;

    if (!url || !title || !author || !price || !desc || !language || !stock || !category || !publisher || !publishedDate || !pages) {
      Swal.fire({
        icon: 'error',
        text: "All fields are required",
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    addBookMutation.mutate(Data, {
      onSuccess: (response) => {
        Swal.fire({
          icon: 'success',
          text: response.data.message,
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
        setData({
          url: "", title: "", author: "", price: "", desc: "",
          language: "", stock: "", category: "", publisher: "",
          publishedDate: "", pages: ""
        });
        setTimeout(() => navigate("/all-books"), 2000);
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          text: error.response?.data?.message || "Something Went Wrong",
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 md:px-8 py-8 text-white">
      <div className="max-w-5xl mx-auto">

        <BackButton to={"/admin/dashboard/inventory"} text='Back To Inventory' />

        <div className="bg-zinc-800 p-6 md:p-8 rounded-xl shadow-lg border border-zinc-700">
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaBook className="text-3xl text-yellow-400" />
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Add New Book
            </h1>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-6">
            {/* Book Image URL */}
            <div className="relative">
              <InputField
                label="Book Image URL"
                name="url"
                type="text"
                value={Data.url}
                onChange={change}
                placeholder="https://example.com/book-image.jpg"
                icon={<FaImage className="text-zinc-400" />}
              />
            </div>

            {/* Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Book Title"
                name="title"
                type="text"
                value={Data.title}
                onChange={change}
                placeholder="Book Title"
                icon={<FaBook className="text-zinc-400" />}
              />
              <InputField
                label="Author"
                name="author"
                type="text"
                value={Data.author}
                onChange={change}
                placeholder="Author Name"
                icon={<FaUserEdit className="text-zinc-400" />}
              />
            </div>

            {/* Language & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Language"
                name="language"
                type="text"
                value={Data.language}
                onChange={change}
                placeholder="English"
                icon={<FaLanguage className="text-zinc-400" />}
              />
              <InputField
                label="Price"
                name="price"
                type="number"
                value={Data.price}
                onChange={change}
                placeholder="0.00"
                icon={<FaDollarSign className="text-zinc-400" />}
              />
            </div>

            {/* Category & Publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Category"
                name="category"
                value={Data.category}
                onChange={change}
                options={categories}
                icon={<FaBoxOpen className="text-zinc-400" />}
              />
              <InputField
                label="Publisher"
                name="publisher"
                value={Data.publisher}
                onChange={change}
                placeholder="Publisher Name"
                icon={<FaBook className="text-zinc-400" />}
              />
            </div>

            {/* Published Date & Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Published Date"
                name="publishedDate"
                value={Data.publishedDate}
                onChange={change}
                type="date"
                icon={<FaCalendarAlt className="text-zinc-400" />}
              />
              <InputField
                label="Pages"
                name="pages"
                value={Data.pages}
                onChange={change}
                type="number"
                placeholder="Total Pages"
                icon={<FaFileAlt className="text-zinc-400" />}
              />
            </div>

            {/* Description */}
            <TextAreaField
              label="Description"
              name="desc"
              value={Data.desc}
              onChange={change}
              placeholder="Enter book description..."
              rows={4}
            />

            {/* Stock Quantity */}
            <InputField
              label="Stock Quantity"
              name="stock"
              value={Data.stock}
              onChange={change}
              type="number"
              placeholder="Available quantity"
              icon={<FaBoxOpen className="text-zinc-400" />}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={addBookMutation.isPending}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${loading
                  ? 'bg-yellow-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-md hover:shadow-lg'
                  }`}
              >
                {addBookMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Book...
                  </>
                ) : (
                  <>
                    <FaBook />
                    Add Book
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
export default AddBook