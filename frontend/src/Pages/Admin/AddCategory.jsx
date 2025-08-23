import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import  BackButton  from '../../Components/common/BackButton';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../store/Categories/categoryThunks';
import { FiPlusCircle, FiLoader } from 'react-icons/fi';
import { useAddCategory } from '../../hooks/Category';

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [categoryname, setCategoryName] = useState('');

  const { categories } = useSelector(state => state.categories);
  const { mutate: addCategory, isLoading, isError, error } = useAddCategory

  const handleAdd = async () => {
    if (!categoryname.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Please enter a category name',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }

    try {
      addCategory(categoryname,
        {
          onSuccess: (response) => {
            Swal.fire({
              icon: 'success',
              title: response.data.message,
              background: '#1f2937',
              color: '#fff',
              confirmButtonColor: '#3b82f6'
            })
            setCategoryName('');
            dispatch(fetchCategories());
          },
          onError: (response) => {
            Swal.fire({
              icon: 'error',
              title: response.data.message,
              background: '#1f2937',
              color: '#fff',
              confirmButtonColor: '#3b82f6'
            });
          }
        }
      )

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Occurred',
        text: error.message,
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  return (
    <section className="p-6 min-h-screen max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
          <BackButton to={"/admin/dashboard/inventory"} text='Back to Inventory' />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Category</h2>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Form Section */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="category-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name
              </label>
              <input
                id="category-input"
                type="text"
                value={categoryname}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Electronics, Clothing, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={isLoading || !categoryname.trim()}
              className="mt-6 sm:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FiPlusCircle />
                  <span>Add Category</span>
                </>
              )}
            </button>
          </div>

          {/* Existing Categories Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Existing Categories</h3>
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No categories found. Add your first category above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-gray-100 dark:bg-zinc-700 py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AddCategory