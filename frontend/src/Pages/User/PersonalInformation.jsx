import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux'

export const PersonalInformation = () => {
  const navigator = useNavigate()

  const [originalValue, setOriginalValue] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { userid, token } = useSelector(state => state.auth)

  // initial personal information
  const [value, setValue] = useState({
    fullname: "",
    email: "",
    address: "",
    gender: "",
    ContactNumber: "",
    BirthDate: ""
  });

  const headers = {
    userid: userid,
    authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:3000/api/user/get-user-information', { headers });

      const user = res.data;
      setValue({
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        gender: user.gender,
        ContactNumber: user.ContactNumber,
        BirthDate: user.BirthDate?.slice(0, 10)
      });
      setOriginalValue({ ...user, BirthDate: user.BirthDate?.slice(0, 10) });
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value: inputVal } = e.target;
    setValue({ ...value, [name]: inputVal });
  };

  const handleSave = async () => {

    try {
      const res = await axios.post('http://localhost:3000/api/user/update-profile', value, { headers });

      if (res.data.success) {
        toast.success(res.data.message);
        setOriginalValue(value);
        setIsEditing(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setValue(originalValue);
    setIsEditing(false);
  };

  return (
    <>
      {/* back button */}
      <button onClick={() => navigator("/profile/settings")} className='px-8 py-3 text-2xl bg-blue-600 mb-4 flex items-center gap-1 text-zinc-300 hover:text-white'><IoMdArrowRoundBack /></button>

      <div className='p-6 bg-zinc-900 text-white rounded-xl relative'>


        <div className='absolute top-4 right-6 text-2xl cursor-pointer' onClick={() => setIsEditing(true)}>
          <FaRegEdit />
        </div>

        {/* personal infromation form */}

        <form className='grid grid-cols-2 gap-4'>
          <div>
            <label>First Name</label>
            <input
              type='text'
              name='firstname'
              value={value.fullname}
              onChange={handleChange}
              className='w-full p-2 bg-zinc-600 rounded'
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type='email'
              name='email'
              value={value.email}
              onChange={handleChange}
              className='w-full p-2 bg-zinc-600 rounded'
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Contact Number</label>
            <input
              type='text'
              name='ContactNumber'
              value={value.ContactNumber}
              onChange={handleChange}
              className='w-full p-2 bg-zinc-600 rounded'
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Birth Date</label>
            <input
              type='date'
              name='BirthDate'
              value={value.BirthDate}
              onChange={handleChange}
              className='w-full p-2 bg-zinc-600 rounded'
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              name='gender'
              value={value.gender}
              onChange={handleChange}
              className='w-full p-2 bg-zinc-600 rounded'
              disabled={!isEditing}
            >
              <option value=''>Select</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className='col-span-2'>
            <label>Address</label>
            <textarea
              name='address'
              value={value.address}
              onChange={handleChange}
              className='w-full p-2 bg-zinc-600 rounded'
              rows={4}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className='col-span-2 flex gap-4 justify-center mt-4'>
              <button type='button' className='bg-green-600 px-6 py-2 rounded' onClick={handleSave}>Save</button>
              <button type='button' className='bg-red-600 px-6 py-2 rounded' onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
