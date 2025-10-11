import React, { useEffect, useState } from 'react';
import BackButton from '../../Components/common/BackButton';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/Categories/categoryThunks';
import { FaBook, FaUserEdit, FaDollarSign, FaBoxOpen, FaCalendarAlt, FaFileAlt, FaLanguage, FaArrowLeft, FaSave } from 'react-icons/fa';
import { useBookById, useUpdateBook } from '../../hooks/Book';
import Loader from '../../Components/common/Loader';

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);

  const { categories, isLoading } = useSelector(state => state.categories);
  const { data: book, isLoading: isFetchBookLoading, isError, error } = useBookById(bookId)
  useEffect(() => {
    if (bookData) {
      setBook(book);   // update local state from API data
    }
  }, [bookId, book]);

  const updateBookMutation = useUpdateBook()
  if (isLoading) {
    return <Loader />
  }

  const handleChange = (field, value) => {
    setBookData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!bookData.title || !bookData.author || !bookData.desc || !bookData.price ||
      !bookData.publisher || !bookData.pages || !bookData.publishedDate || !bookData.stock) {
      return Swal.fire({
        icon: 'warning',
        text: 'Please fill all required fields.',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }


    try {

      updateBookMutation.mutate(bookId, bookData, {
        onSuccess: (response) => {
          Swal.fire({
            icon: 'success',
            text: response.message,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
          navigate('/admin/dashboard/inventory');
        },
        onError: (response) => {
          Swal.fire({
            icon: 'error',
            text: response.data.message,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: `Update failed: ${error.message}`,
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  if (!isFetchBookLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <Loader />
      </div>
    );
  }

  const formFields = [
    { label: "Title", field: "title", icon: <FaBook className="text-zinc-400" /> },
    { label: "Author", field: "author", icon: <FaUserEdit className="text-zinc-400" /> },
    { label: "Price", field: "price", icon: <FaDollarSign className="text-zinc-400" />, type: "number" },
    { label: "Stock Quantity", field: "stock", icon: <FaBoxOpen className="text-zinc-400" />, type: "number" },
    { label: "Language", field: "language", icon: <FaLanguage className="text-zinc-400" /> },
    { label: "Publisher", field: "publisher", icon: <FaBook className="text-zinc-400" /> },
    { label: "Published Date", field: "publishedDate", icon: <FaCalendarAlt className="text-zinc-400" />, type: "date" },
    { label: "Pages", field: "pages", icon: <FaFileAlt className="text-zinc-400" />, type: "number" }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <BackButton to={"/admin/dashboard/inventory"} text='Back' />
        <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex items-center gap-3">
              <FaBook className="text-2xl text-white" />
              <h1 className="text-2xl font-bold text-white">Edit Book Details</h1>
            </div>
            <p className="text-blue-100 mt-1">Update the book information below</p>
          </div>

          <form onSubmit={handleUpdate} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {formFields.map(({ label, field, icon, type = "text" }) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">{label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {icon}
                    </div>
                    <input
                      type={type}
                      value={bookData[field] || ""}
                      onChange={e => handleChange(field, e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBoxOpen className="text-zinc-400" />
                </div>
                <select
                  value={bookData.category || ""}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea
                value={bookData.desc || ""}
                onChange={e => handleChange('desc', e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={updateBookMutation.isPending}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${updating
                  ? 'bg-blue-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                  }`}
              >
                {updatingMutation.isPending ? (
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
export default EditBook