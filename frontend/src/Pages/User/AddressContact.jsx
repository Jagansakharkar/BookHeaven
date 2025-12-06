import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useGetUserAddress, useUpdateUserAddress } from '../../hooks/User';
import BackButton from '../../Components/common/BackButton';
const AddressContact = () => {
  const navigator = useNavigate();

  const [address, setAddress] = useState({
    fullname: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const { data, isLoading: isFetching } = useGetUserAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateUserAddress();

  useEffect(() => {
    if (data?.address) {
      setAddress({
        name: data.address.name||'',
        phone: data.address.phone||'',
        street: data.address.street||'',
        city: data.address.city||'',
        state: data.address.state||'',
        pincode: data.address.pincode||'',

      });
    }
  }, [data]);

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateAddress(address, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Address updated successfully!',
          confirmButtonColor: '#3b82f6',
          background: '#18181b',
          color: '#fff'
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to update address',
          confirmButtonColor: '#3b82f6',
          background: '#18181b',
          color: '#fff'
        });
      }
    });
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-blue-400">Loading address information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <BackButton to="/profile/settings" text='Back to Settings' />

        <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h2 className="text-2xl font-bold">Contact & Address Information</h2>
            <p className="text-blue-100 mt-1">Update your delivery details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={address.name || ''}
                  onChange={handleChange}
                  placeholder="abc xyz"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={address.phone || ''}
                  onChange={handleChange}
                  placeholder="234 567 8900"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-zinc-300 mb-1">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street || ''}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-zinc-300 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={address.city || ''}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-zinc-300 mb-1">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={address.state || ''}
                  onChange={handleChange}
                  placeholder="NY"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-zinc-300 mb-1">Postal/Zip Code</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={address.pincode || ''}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${isUpdating
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
              >
                {isUpdating ? 'Updating...' : 'Update Address'}
              </button>
            </div>

          
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressContact;