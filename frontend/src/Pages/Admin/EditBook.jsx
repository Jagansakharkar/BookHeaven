import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '../../Components/common/BackButton';

import { useSelector } from 'react-redux';
import { fetchCategories } from '../../store/Categories/categoryThunks';
import { useDispatch } from 'react-redux';

export const EditBook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { bookid } = useParams();
  const [bookData, setBookData] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { userid, token } = useSelector(state => state.auth);
  const { categories } = useSelector(state => state.categories);

  console.log(categories)

  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    dispatch(fetchCategories());
    const fetchBook = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/books/get-book-by-id/${bookid}`,
          { headers }
        );
        setBookData(res.data.data);
      } catch (error) {
        Swal.fire({ icon: 'error', text: `Error fetching book: ${error.message}` });
      }
    };
    fetchBook();
  }, [bookid, dispatch]);

  const handleChange = (field, value) => {
    setBookData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!bookData.title || !bookData.author || !bookData.desc || !bookData.price || !bookData.publisher || !bookData.pages || !bookData.publishedDate || !bookData.stock) {
      return Swal.fire({ icon: 'warning', text: 'Please fill all required fields.' });
    }

    setUpdating(true);
    try {
      const res = await axios.put(
        `http://localhost:3000/api/admin/books/update-book/${bookid}`,
        bookData,
        { headers }
      );

      if (res.data.success) {
        Swal.fire({ icon: 'success', text: res.data.message });
        navigate('/admin/dashboard/inventory');
      } else {
        Swal.fire({ icon: 'error', text: res.data.message });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', text: `Update failed: ${error.message}` });
    } finally {
      setUpdating(false);
    }
  };

  if (!bookData) {
    return (
      <div className="text-center text-white py-10">
        <div className="loader mx-auto mb-2"></div>
        <p>Loading book data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-xl mx-auto">

      <BackButton to={"/admin/dashboard/inventory"} text='Back' />

      <h2 className="text-2xl font-bold mb-4">Edit Book</h2>

      {[
        { label: "Title", field: "title" },
        { label: "Author", field: "author" },
        { label: "Description", field: "desc", isTextarea: true },
        { label: "Price", field: "price" },
        { label: "Stock", field: "stock" },
        { label: "Language", field: "language" },
        { label: "Publisher", field: "publisher" },
        { label: "Published Date", field: "publishedDate", type: "date" },
        { label: "Pages", field: "pages", type: "number" }
      ].map(({ label, field, isTextarea, type = "text" }) => (
        <div key={field} className="mb-4">
          <label className="block mb-1">{label}</label>
          {isTextarea ? (
            <textarea
              value={bookData[field] ?? ""}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded"
            />
          ) : (
            <input
              type={type}
              value={bookData[field] ?? "x"}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded"
            />
          )}
        </div>
      ))}

      {/* Category Dropdown */}
      <div className="mb-4">
        <label htmlFor="category" className="block mb-1">Category</label>
        <select
          id="category"
          value={bookData.category ?? ""}
          onChange={e => handleChange('category', e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={updating}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {updating ? 'Updating...' : 'Update Book'}
      </button>
    </div>
  );
};
