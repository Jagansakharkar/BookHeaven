import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import BackButton from '../../Components/common/BackButton';
import { FaEdit, FaUserPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { CiSearch, CiFilter } from "react-icons/ci";
import { FiRefreshCw } from "react-icons/fi";
import { useAllCustomers, useDeleteCustomer, useFilterByGender, useSearchUser } from '../../hooks/customers';

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gender, setGender] = useState('all');
  const { data: allCustomers, isLoading, isError, error } = useAllCustomers()

  useEffect(() => {
    setCustomers(allCustomers)
  }, [allCustomers])
  const deleteCustomerMutation = useDeleteCustomer()
  const filterByGenderMutation = useFilterByGender()
  const searchUserMutation = useSearchUser()

  // Delete customer
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the customer permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280'
    });

    if (confirm.isConfirmed) {
      try {
        deleteCustomerMutation.mutate(
          {
            onSuccess: (response) => {
              setCustomers(customers.filter(c => c._id !== userId));
              Swal.fire({
                title: 'Deleted!',
                text: 'Customer has been deleted.',
                icon: 'success',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#3b82f6'
              });
            },
            onError: (response) => {
              Swal.fire({
                title: 'Error',
                text: 'Could not delete customer.',
                icon: 'error',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#3b82f6'
              });
            }
          }
        )

      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Could not delete customer.',
          icon: 'error',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  // Filter by gender
  const handleGenderChange = async (genderValue) => {
    setGender(genderValue);

    if (genderValue === 'all') {
      // fetchCustomers(); // Reset to full list
      return;
    }

    try {
      filterByGenderMutation.mutate(genderValue)
      //   {
      //     onSuccess: (response) => {
      //       setCustomers(response.data.data);
      //     },
      //     onError: (response) => {
      //       Swal.fire({
      //         icon: 'error',
      //         text: response.data.message,
      //         background: '#1f2937',
      //         color: '#fff',
      //         confirmButtonColor: '#3b82f6'
      //       });
      //     }
      //   }
      // )
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: "Error Occurred While Filtering",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BackButton to={-1} text='Back' />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
          </div>

          <Link
            to="/admin/dashboard/add-customer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition-colors"
          >
            <FaUserPlus />
            <span>Add Customer</span>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Customers
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiSearch className="text-gray-400" size={20} />
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name, email..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="w-full md:w-auto">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiFilter className="text-gray-400" />
                </div>
                <select
                  id="gender"
                  className="pl-10 appearance-none bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-white py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                // onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? <FiRefreshCw className="animate-spin" /> : <CiSearch />}
                <span className="hidden sm:inline">Search</span>
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setGender('all');
                  // fetchCustomers();
                }}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiRefreshCw />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
              <thead className="bg-gray-50 dark:bg-zinc-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                {filterByGenderMutation.isPending ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <FiRefreshCw className="animate-spin text-blue-500" size={24} />
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-600 flex items-center justify-center">
                            <span className="text-gray-700 dark:text-white font-medium">
                              {customer.fullname?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.fullname || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.ContactNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.gender === 'male'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : customer.gender === 'female'
                            ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}>
                          {customer.gender || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-600 rounded-full">
                          {customer.orders?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/dashboard/edit-customer/${customer._id}`)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Customers;