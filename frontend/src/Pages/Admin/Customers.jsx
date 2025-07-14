import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { BackButton } from '../../Components/common/BackButton';

import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CiSearch } from "react-icons/ci";

export const Customers = () => {
  const navigate = useNavigate();
  const { token, userid } = useSelector(state => state.auth)

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gender, setGender] = useState('all');

  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/user/get-all-customers', { headers });
      setCustomers(res.data.data);
    } catch (err) {
      Swal.fire({ icon: 'error', text: 'Failed to load customers' });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Search customers
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/user/user-search?term=${searchTerm}`,
        { headers }
      );
      setCustomers(response.data.data);
    } catch (error) {
      Swal.fire({ icon: 'error', text: 'Failed to search user' });
    }
  };

  // Delete customer
  const handleDelete = async (userid) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the customer permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/user/delete-customer/${userid}`, { headers });
        setCustomers(customers.filter(c => c._id !== userid));
        Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Could not delete customer.', 'error');
      }
    }
  };

  // Filter by gender
  const handleGenderChange = async (genderValue) => {
    setGender(genderValue);

    if (genderValue === 'all') {
      fetchCustomers(); // Reset to full list
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/user/filter-by-gender',
        { gender: genderValue },
        { headers }
      );

      if (response.data.success) {
        setCustomers(response.data.data);
      } else {
        Swal.fire({ icon: 'error', text: response.data.message });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', text: "Error Occurred While Filtering" });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 text-zinc-100 bg-zinc-950 min-h-screen">
      <BackButton to={-1} text='Back' />


      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Customer Management</h1>
      </div>

      <div className="mb-6 bg-zinc-900 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search username or email or name ..."
            className="px-4 py-2 rounded-md bg-zinc-800 text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-all"
            onClick={handleSearch}
          >
            <CiSearch size={20} />
            <span className="hidden sm:inline">Search</span>
          </button>

          {searchTerm.trim() && (
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-all"
              onClick={() => {
                setSearchTerm('');
                fetchCustomers();
              }}
            >
              Show All
            </button>
          )}

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="gender" className="text-white">Filter by Gender:</label>
            <select
              name="gender"
              id="gender"
              className="bg-zinc-800 text-white px-3 py-1 rounded"
              value={gender}
              onChange={(e) => handleGenderChange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Add Customer */}
          <div className="flex-shrink-0">
            <Link to="/admin/dashboard/add-customer" className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md text-white transition-all">
              + Add Customer
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-zinc-800 text-white">
          <thead className="bg-zinc-900 sticky top-0">
            <tr>
              <th className="p-2">UserId</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Role</th>
              <th className="p-2">Joined</th>
              <th className="p-2">Total Orders</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="text-center hover:bg-zinc-700">
                  <td className="p-2">{customer._id}</td>
                  <td className="p-2">{customer.fullname}</td>
                  <td className="p-2">{customer.email}</td>
                  <td className="p-2">{customer.address?.phone || "N/A"}</td>
                  <td className="p-2">{customer.role}</td>
                  <td className="p-2">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{customer.orders?.length || 0}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/admin/dashboard/edit-customer/${customer._id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(customer._id)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-zinc-400">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
