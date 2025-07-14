import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Sidebar } from '../../Components/User/Sidebar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loader } from '../../Components/common/Loader'
import { MobileNav } from '../../Components/User/MobileNav'

export const Profile = () => {

  const [Profile, setProfile] = useState()
  const { userid, token } = useSelector(state => state.auth)

  const headers = {
    userid: userid,
    authorization: `Bearer ${token}`
  };

  // get information of user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/get-user-information', { headers })
        setProfile(response.data)
      } catch (error) {
        console.error("Error fetching user information:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className=' bg-zinc-900   px-2 py-8 md:px-12 flex flex-col md:flex-row '>

      {!Profile && <div className='w-full flex items-center justify-center'><Loader /></div>}
      {Profile && (
        <>
          <div className='w-full md:w-1/6 lg:3/6 h-auto lg:h-screen'>
            <Sidebar data={Profile} />
            <MobileNav />
          </div>
          <div className='w-full md:w-5/6'>
            <Outlet />
          </div>

        </>
      )}
    </div>
  )
}
