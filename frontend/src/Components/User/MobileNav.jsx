import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const MobileNav = () => {
  const role = useSelector((state) => state.auth.role)
  return (
    <>
      <div className='w-full lg:hidden flex items-center  justify-between my-4'>

        {role === "user" && (
          <>
            <Link
              to="/profile"
              className='text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all duration-300'>
              Favourites</Link>

            <Link
              to="/profile/orderHistory"
              className='text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all duration-300'>
              Order History</Link>
            <Link
              to="/profile/settings"
              className='text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all duration-300'>
              Settings
            </Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link
              to="/profile"
              className='text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all duration-300'>
              All Orders</Link>

            <Link
              to="/profile/add-book"
              className='text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all duration-300'>
              Add Book</Link>

          </>
        )}
      </div>
    </>
  )
}
