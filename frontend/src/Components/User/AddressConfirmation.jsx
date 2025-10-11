import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit2, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { useGetUserAddress } from '../../hooks/User';
import Loader from '../../Components/common/Loader'

const AddressConfirmation = () => {
  const navigate = useNavigate();
  const { data: address, isLoading } = useGetUserAddress();

  const handleProceedPayment = () => {
    if (!address) {
      Swal.fire({
        icon: 'warning',
        title: 'Address Required',
        text: 'Please provide your delivery address before proceeding.',
        confirmButtonColor: '#3b82f6',
        background: '#18181b',
        color: '#fff'
      });
      return;
    }

    const requiredFields = {
      fullname: address.fullname,
      phone: address.phone,
      street: address.street,
      city: address.city,
      pincode: address.pincode
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Address',
          text: `Please provide your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          confirmButtonColor: '#3b82f6',
          background: '#18181b',
          color: '#fff'
        });
        return;
      }
    }

    navigate("/payment", { state: { address } })
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
          <span>Back</span>
        </button>

        <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h2 className="text-2xl font-bold">Confirm Delivery Address</h2>
            <p className="text-blue-100 mt-1">Review your details before proceeding to payment</p>
          </div>

          <div className="p-6">
            {address ? (
              <div className="space-y-5">
                <div className="bg-zinc-700/50 p-5 rounded-lg border border-zinc-600">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-3 pl-8">
                    <p className="flex items-start gap-3">
                      <span className="font-medium min-w-[80px]">Name:</span>
                      <span>{address.fullname}</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="font-medium min-w-[80px]">Phone:</span>
                      <span>{address.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-700/50 p-5 rounded-lg border border-zinc-600">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-400" />
                    Delivery Address
                  </h3>
                  <div className="space-y-3 pl-8">
                    <p className="flex items-start gap-3">
                      <span className="font-medium min-w-[80px]">Street:</span>
                      <span>{address.street}</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="font-medium min-w-[80px]">City:</span>
                      <span>{address.city}</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="font-medium min-w-[80px]">Pincode:</span>
                      <span>{address.pincode}</span>
                    </p>
                    {address.state && (
                      <p className="flex items-start gap-3">
                        <span className="font-medium min-w-[80px]">State:</span>
                        <span>{address.state}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                  <button
                    onClick={() => navigate('/profile/settings/address-contact')}
                    className="flex items-center justify-center gap-2 bg-zinc-600 hover:bg-zinc-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                    {address ? 'Edit Address' : 'Add Address'}
                  </button>

                  <button
                    onClick={handleProceedPayment}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <FiCheckCircle className="text-lg" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="bg-zinc-700/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="text-3xl text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Address Found</h3>
                <p className="text-zinc-300 mb-6">Please add your delivery address to continue</p>
                <button
                  onClick={() => navigate('/profile/settings/address-contact')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Add Address Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddressConfirmation