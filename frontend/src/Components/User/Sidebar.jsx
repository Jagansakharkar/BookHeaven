import React from 'react'
import { FaHeart, FaHistory, FaCog } from "react-icons/fa"
//import { FaArrowRightFromBracket } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { authActions } from '../../store/auth/authSlice'
import { useDispatch } from 'react-redux'

export const Sidebar = ({ data }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(authActions.logout())
    navigate("/")
  }

  return (
    <div className='flex flex-col bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700 shadow-lg overflow-hidden h-full p-4 transition-all duration-300 hover:border-zinc-600'>
      {/* Profile Section */}
      <div className='flex flex-col items-center py-6'>
        <div className='relative mb-4'>
          <img
            src={data.avatar}
            alt="Profile"
            className='w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md'
          />
          <div className='absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-green-500 border-2 border-zinc-800'></div>
        </div>
        <h3 className='text-xl font-semibold text-white'>{data.username}</h3>
        <p className='text-sm text-zinc-400 mt-1'>{data.email}</p>
      </div>

      {/* Navigation Links */}
      <div className='flex-1 space-y-2'>
        <div className='hidden lg:block space-y-1'>
          <Link
            to="/profile"
            className='flex items-center px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-all duration-200 group'
          >
            <FaHeart className='mr-3 text-blue-400 group-hover:text-blue-300' />
            <span className='font-medium'>Favorites</span>
          </Link>

          <Link
            to="/profile/orderHistory"
            className='flex items-center px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-all duration-200 group'
          >
            <FaHistory className='mr-3 text-blue-400 group-hover:text-blue-300' />
            <span className='font-medium'>Order History</span>
          </Link>

          <Link
            to="/profile/settings"
            className='flex items-center px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-all duration-200 group'
          >
            <FaCog className='mr-3 text-blue-400 group-hover:text-blue-300' />
            <span className='font-medium'>Settings</span>
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className='flex items-center justify-center px-4 py-3 bg-zinc-700/50 hover:bg-red-600/80 text-white rounded-lg transition-all duration-200 mt-4 border border-zinc-700 hover:border-red-500'
      >
        <span className='font-medium'>Log Out</span>
       {/* <FaArrowRightFromBracket className='ml-3' /> */}
      </button>
    </div>
  )
}