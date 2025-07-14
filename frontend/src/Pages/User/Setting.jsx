import axios from 'axios'
import Swal from 'sweetalert2'

import React, { useEffect, useState } from 'react'
import { Loader } from "../../Components/common/Loader"
import { FaRegEdit } from "react-icons/fa";
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';

export const Setting = () => {

  const navigator = useNavigate()
  const { userid, token } = useSelector(state => state.auth)

  const [Value, setValue] = useState({ address: "" })
  const [ProfileData, setProfileData] = useState()

  const headers = {
    userid,
    authorization: `Bearer ${token}`
  }

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get('http://localhost:3000/api/user/get-user-information', { headers })

      setProfileData(response.data)
      setValue({ address: response.data.address })
    }
    fetch()
  }, [])

  const change = (e) => {
    const { name, value } = e.target;
    setValue({ ...Value, [name]: value })
  }

  const submitAddress = async () => {
    try {
      const response = await axios.put("http://localhost:3000/api/user/update-address", Value, { headers })


      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          text: response.data.data
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          text: response.data.data
        })

      }
    }
    catch (error) {
      Swal.fire({
        icon: 'error',
        text: "Error Occurred While Updating Address"
      })
    }
  }

  return (
    <>
      {/* back button */}
      <button onClick={() => navigator("/profile")} className='px-8 py-3 text-2xl bg-blue-600 mb-4 flex items-center gap-1 text-zinc-300 hover:text-white'><IoMdArrowRoundBack /></button>

      <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
        Settings
      </h1>
      <div className='ml-4 text-xl w-[100%] text-center text-white rounded-md'>

        {/* setting navbar */}
        <div className='bg-zinc-700 flex'>
          <Link to={'personal-info'}>
            <p className='p-3 m-2 w-[20rem] hover:bg-zinc-600 duration-300 ease-in-out rounded-md cursor-pointer'
            >Personal Information</p>
          </Link>
          <Link to={'address-contact'}>
            <p className='p-3 m-2 w-[20rem] rounded-md hover:bg-zinc-600 duration-300 ease-in-out cursor-pointer'>Address and Contact</p>
          </Link>
          <Link to={'account-security'}>
            <p className='p-3 m-2 w-[20rem] rounded-md hover:bg-zinc-600 duration-300 ease-in-out cursor-pointer'>Account Security</p>
          </Link>
          <Link to={'notification-setting'}>
            <p className='p-3 m-2 w-[20rem] rounded-md hover:bg-zinc-600  duration-300 ease-in-out cursor-pointer'>Notification Setting</p>
          </Link>
        </div>

        {/* page based on selected on navbar */}
        <div>
          <Outlet />
        </div>
      </div>
    </>
  )
}
