import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth/authSlice';// Update path as needed

export const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/');
  };

  return (
    <div className='bg-zinc-800 text-white flex flex-col p-6 h-full w-full gap-3'>
      <Link to="/admin/dashboard/analytics" className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'>
        Analytics
      </Link>
      <Link to="/all-books" className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'>
        All Books
      </Link>
      <Link to="/admin/dashboard/orders" className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'>
        Orders
      </Link>
      <Link to="/admin/dashboard/inventory" className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'>
        Inventory
      </Link>
      <Link to="/admin/dashboard/customers" className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'>
        Customers
      </Link>
      <Link to="/admin/dashboard/settings" className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'>
        Settings
      </Link>

      <button
        className='mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center gap-2'
        onClick={handleLogout}
      >
        Log Out <FaArrowRightFromBracket />
      </button>
    </div>
  );
};

