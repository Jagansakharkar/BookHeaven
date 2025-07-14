import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../../Components/Admin/AdminSidebar'


export const Dashboard = () => {
  return (
    <div className='m-2 grid grid-cols-[250px_1fr] h-screen text-center'>
      <AdminSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}
