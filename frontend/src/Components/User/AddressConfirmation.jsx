import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export const AddressConfirmation = () => {
  const { userid, token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    userid: userid,
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/get-user-address`, { headers });
        setData(res.data.data);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error loading address',
          text: err.response?.data?.message || err.message,
          confirmButtonColor: '#3b82f6'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserAddress();
  }, []);

  const handleProceedPayment = () => {
    if (!data || !data.address) {
      Swal.fire({
        icon: 'warning',
        title: 'Address Required',
        text: 'Please provide your delivery address before proceeding.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const requiredFields = {
      fullname: data.fullname,
      phone: data.address.phone,
      street: data.address.street,
      city: data.address.city,
      pincode: data.address.pincode
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Address',
          text: `Missing: ${key}`,
          confirmButtonColor: '#3b82f6'
        });
        return;
      }
    }

    navigate("/payment");
  };


  if (loading) {
    return <div className="text-center mt-10 text-white animate-pulse">Loading address...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-zinc-800 text-white shadow-lg p-6 mt-10 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Confirm Your Delivery Address</h2>

      {data ? (
        <div className="space-y-2 mb-6">
          <p><strong>Name:</strong> {data.fullname}</p>
          <p><strong>Phone:</strong> {data.address.phone}</p>
          <p><strong>Street:</strong> {data.address.street}</p>
          <p><strong>City:</strong> {data.address.city}</p>
          <p><strong>Pincode:</strong> {data.address.pincode}</p>
        </div>
      ) : (
        <p>No address found. Please update your profile.</p>
      )}

      <div className="flex justify-between gap-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
          onClick={() => navigate('/profile/settings/address-contact')}
        >
          {data ? 'Edit Address' : 'Add Address'}
        </button>

        {data && (
          <button
            onClick={handleProceedPayment}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
          >
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
};
