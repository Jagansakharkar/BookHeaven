import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { BackButton } from '../../Components/common/BackButton';

import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../store/Categories/categoryThunks';

export const AddCategory = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [categoryname, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const { userid, token } = useSelector(state => state.auth);
  const { categories } = useSelector(state => state.categories);

  const headers = {
    userid,
    Authorization: `Bearer ${token}`
  };

  const handleAdd = async () => {
    if (!categoryname.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Please enter a category name'
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/admin/category/add-category',
        { name: categoryname },
        { headers }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: response.data.message
        });
        setCategoryName('');
        dispatch(fetchCategories());
      } else {
        Swal.fire({
          icon: 'error',
          title: response.data.message
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Occurred',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 min-h-screen max-w-6xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-md space-y-6">

      <BackButton to={"/admin/dashboard/inventory"} text='Back' />


      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Category</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={categoryname}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-white"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mt-4">Existing Categories:</h3>
        <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-200">
          {categories.length === 0 && <li>No categories found</li>}
          {categories.map((category) => (
            <li key={category._id} className='list-none bg-gray-600 py-2 mb-2 rounded-sm px-4'>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
