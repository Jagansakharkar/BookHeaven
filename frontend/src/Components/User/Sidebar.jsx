import React from 'react'
import { FaArrowRightFromBracket } from "react-icons/fa6"
import { Link, useNavigate } from 'react-router-dom'
import { authActions } from '../../store/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const Sidebar = ({ data }) => {

  const dispatch = useDispatch()
  const history = useNavigate()


  return (
    <div className='bg-zinc-800 p-2 rounded flex flex-col items-center justify-between h-auto lg:h-[100%] '>

      <div className='flex flex-col items-center justify-center'>
        {" "}
        <img src={data.avatar} alt="Photo" className='h-[12vh]' />
        <p className='mt-3 text-xl text-zinc-100 font-semibold'>{data.username}</p>
        <p className='mt-1 text-normal text-zinc-300'>{data.email}</p>
        <div className='w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block'></div>
      </div>

      <div className='w-full flex-col items-center justify-center hidden lg:flex'>
        <Link
          to="/profile"
          className='text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300'>
          Favourites
        </Link>

        <Link
          to="/profile/orderHistory"
          className='text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300'>
          Order History
        </Link>

        <Link
          to="/profile/settings"
          className='text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300'>
          Settings
        </Link>
      </div>

      <button className='py-1 px-2 bg-zinc-900 w-3/6 lg:w-full mt-4 lg:mt-0 text-white font-semibold flex items-center justify-center '
        onClick={() => {
          dispatch(authActions.logout())

          history("/")
        }}>
        Log Out <FaArrowRightFromBracket className='ms-4'
        /></button>
    </div>
  )
}
