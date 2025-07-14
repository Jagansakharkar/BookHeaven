import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '../../Components/common/BackButton';

import { useSelector } from 'react-redux';

export const EditCustomer = () => {
  const { customerid } = useParams();
  const navigate = useNavigate();
  const { userid, token } = useSelector(state => state.auth);

  const [customerData, setCustomerData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    avatar: '',
    role: 'user',
    BirthDate: '',
    gender: '',
    address: {
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const headers = {
    userid,
    authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/user/get-customer-byId/${customerid}`, { headers });
        const data = response.data.data[0];

        const formattedDate = data.BirthDate
          ? new Date(data.BirthDate).toISOString().split('T')[0]
          : '';

        setCustomerData({
          fullname: data.fullname || '',
          username: data.username || '',
          email: data.email || '',
          password: '',
          avatar: data.avatar || '',
          role: data.role || 'user',
          BirthDate: formattedDate,
          gender: data.gender || '',
          address: {
            phone: data.address?.phone || '',
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            pincode: data.address?.pincode || ''
          }
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch customer',
          text: err.message
        });
      }
    };

    fetchCustomer();
  }, [customerid, headers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setCustomerData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value
        }
      }));
    } else {
      setCustomerData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3000/api/admin/update-customer`,
        { ...customerData, customerid },
        { headers }
      );
      Swal.fire({
        icon: res.data.success ? 'success' : 'error',
        text: res.data.message
      });
      if (res.data.success) navigate(-1);
    } catch (error) {
      Swal.fire({ icon: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-zinc-950 text-white">

      <BackButton to={"/admin/dashboard"} text='Back' />


      <h1 className="text-3xl font-bold mb-6">Edit Customer</h1>

      <form onSubmit={handleSubmit} className="grid gap-5 max-w-3xl">
        {/* Full Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={customerData.fullname}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={customerData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={customerData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            required
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block mb-1">Birth Date</label>
          <input
            type="date"
            name="BirthDate"
            value={customerData.BirthDate}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1">Gender</label>
          <select
            name="gender"
            value={customerData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Avatar */}
        <div>
          <label className="block mb-1">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={customerData.avatar}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1">Role</label>
          <select
            name="role"
            value={customerData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Address Section */}
        <div className="border-t border-zinc-700 pt-5">
          <h2 className="text-xl font-semibold mb-4">Address</h2>

          {/* Phone */}
          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="text"
              name="address.phone"
              value={customerData.address.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 rounded"
              maxLength={10}
            />
          </div>

          {/* Street */}
          <div>
            <label className="block mb-1">Street</label>
            <input
              type="text"
              name="address.street"
              value={customerData.address.street}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 rounded"
            />
          </div>

          {/* City */}
          <div>
            <label className="block mb-1">City</label>
            <input
              type="text"
              name="address.city"
              value={customerData.address.city}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 rounded"
            />
          </div>

          {/* State */}
          <div>
            <label className="block mb-1">State</label>
            <input
              type="text"
              name="address.state"
              value={customerData.address.state}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 rounded"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block mb-1">Pincode</label>
            <input
              type="text"
              name="address.pincode"
              value={customerData.address.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 rounded"
              maxLength={6}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-medium"
        >
          Update Customer
        </button>
      </form>
    </div>
  );
};
