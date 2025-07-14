import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';

export const AddressContact = () => {
  const { userid, token } = useSelector(state => state.auth)

  const navigator = useNavigate()

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const headers = {
    userid: userid,
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/get-user-address`, { headers });

        if (res.data.success && res.data.address) {
          setAddress(res.data.address);
        }
      } catch (error) {
        setMessage('Failed to fetch address.');
      }
    };
    fetchAddress();
  }, []);

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.put(`http://localhost:3000/api/user/update-address/${userid}`, address, { headers });
      if (res.data.success) {
        Swal.fire({ icons: 'success', text: 'Address updated successfully!' });
      } else {
        Swal.fire({ icons: 'error', text: 'Something went wrong.' });
      }
    } catch (error) {
      Swal.fire({ icons: 'error', text: 'Failed to update address.' });
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => navigator("/profile/settings")} className='px-8 py-3 text-2xl bg-blue-600 mb-4 flex items-center gap-1 text-zinc-300 hover:text-white'><IoMdArrowRoundBack /></button>
      <div className="max-w-xl mx-auto mt-10 bg-zinc-900 text-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Update Contact & Address</h2>

        <div className="grid gap-4">

          <input
            type="text"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="bg-zinc-800 p-2 rounded"
          />
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Street Address"
            className="bg-zinc-800 p-2 rounded"
          />
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="City"
            className="bg-zinc-800 p-2 rounded"
          />
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="State"
            className="bg-zinc-800 p-2 rounded"
          />
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="bg-zinc-800 p-2 rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-green-400 hover:bg-green-500 text-black py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Address'}
        </button>

        {message && <p className="mt-3 text-yellow-300 text-sm">{message}</p>}
      </div>
    </>
  );
};
