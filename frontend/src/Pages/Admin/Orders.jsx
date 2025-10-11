import React, { useEffect, useState, useCallback } from 'react';
import Loader from '../../Components/common/Loader'
import Swal from 'sweetalert2';
import { MdDeleteOutline, MdFilterList } from "react-icons/md";
import { FaEdit, FaSearch, FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useChangeOrderStatus, useDeleteOrder, useFetchOrders, useHandleOrderUpdate, useHandlePaymentStatusChange } from '../../hooks/Order';
import BackButton from '../../Components/common/BackButton';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [originalOrders, setOriginalOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { data: ordersData, isLoading: isFetchOrderLoading } = useFetchOrders()
  const deleteOrderMutation = useDeleteOrder()
  const changeOrderStatusMutation = useChangeOrderStatus()
  const handleOrderStatusMutation = useHandlePaymentStatusChange()

  console.log("order",ordersData)
  const allStatuses = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Canceled"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400';
      case 'Canceled': return 'bg-red-500/20 text-red-400';
      case 'Shipped':
      case 'Out for Delivery': return 'bg-blue-500/20 text-blue-400';
      case 'Packed': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/20 text-green-400';
      case 'Failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };
  // set data initially
  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData);
      setOriginalOrders(ordersData);
    }
  }, [ordersData]);


  const handleDelete = async (orderId) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This order will be deleted permanently!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444'
    });

    if (confirm.isConfirmed) {
      try {
        deleteOrderMutation.mutate(orderId,
          {
            onSuccess: (response) => {
              setOrders(prev => prev.filter(o => o._id !== orderid));
              Swal.fire({
                title: 'Deleted!',
                text: res.data.message,
                icon: 'success',
                background: '#18181b',
                color: '#fff',
                confirmButtonColor: '#3b82f6'
              });
            },
            onError: (response) => {
              Swal.fire({
                title: 'Error',
                text: res.data.message,
                icon: 'error',
                background: '#18181b',
                color: '#fff',
                confirmButtonColor: '#3b82f6'
              });
            }
          }
        )
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: `Failed to delete order: ${err.message}`,
          icon: 'error',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleStatusChange = async (orderId, e) => {
    const newStatus = e.target.value;
    try {
      changeOrderStatusMutation.mutate(orderId, newStatus, {
        onSuccess: (response) => {
          setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
          Swal.fire({
            icon: 'success',
            text: response.data.message,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        },
        onError: (response) => {
          Swal.fire({
            icon: 'error',
            text: `Status update failed: ${response.message}`,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        }
      })

    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: `Status update failed: ${err.message}`,
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handlePaymentStatusChange = async (orderId, e) => {
    const newStatus = e.target.value;
    try {
      handleOrderStatusMutation.mutate(orderId, newStatus, {
        onSuccess: (response) => {
          setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: newStatus } : o));
          Swal.fire({
            icon: 'success',
            text: response.data.message,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        },
        onError: (response) => {
          Swal.fire({
            icon: 'error',
            text: `Payment status update failed: ${response.message}`,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        }
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: `Payment status update failed: ${err.message}`,
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handleFilter = (status) => {
    setActiveFilter(status);
    if (status === "All") {
      setOrders(originalOrders);
    } else {
      setOrders(originalOrders.filter(o => o.status === status));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = originalOrders.filter(order =>
      order._id.toLowerCase().includes(term) ||
      (order.user?.fullname?.toLowerCase().includes(term)) ||
      order.books.some(book => book.title.toLowerCase().includes(term))
    );
    setOrders(filtered);
  };

  return (
    <div className="h-auto bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto">

        <BackButton to={"/admin/dashboard"} text='Back to Dashboard' />
        <div className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Orders Management</h1>
                <p className="text-blue-100">View and manage customer orders</p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 bg-zinc-800 border-b border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <MdFilterList className="text-lg" />
              <span className="font-medium">Filter by status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilter("All")}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeFilter === "All" ? 'bg-blue-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}
              >
                All
              </button>
              {allStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => handleFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeFilter === status ? getStatusColor(status) + ' font-semibold' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                >
                  {status === 'Packed' && <FaBox className="text-xs" />}
                  {status === 'Shipped' && <FaShippingFast className="text-xs" />}
                  {status === 'Delivered' && <FaCheckCircle className="text-xs" />}
                  {status === 'Canceled' && <FaTimesCircle className="text-xs" />}
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          {isFetchOrderLoading ? <div className='flex justify-center items-center h-full'> <Loader /></div>
            :
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-700">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Items</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Payment</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-zinc-400">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-zinc-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-400">{order._id.substring(0, 8)}...</div>
                            <div className="text-xs text-zinc-400">{order.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{order.user.fullname || "Unknown"}</div>
                            <div className="text-xs text-zinc-400">{order.address?.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              {order.books.slice(0, 2).map((b, idx) => (
                                <div key={idx} className="mb-1">
                                  {b.title} <span className="text-zinc-400">(x{b.quantity})</span>
                                </div>
                              ))}
                              {order.books.length > 2 && (
                                <div className="text-xs text-blue-400">+{order.books.length - 2} more</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleTimeString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className={`text-sm px-2 py-1 rounded ${getStatusColor(order.status)}`}
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e)}
                            >
                              {allStatuses.map(status => (
                                <option key={status} value={status} className="bg-zinc-900">{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className={`text-sm px-2 py-1 rounded ${getPaymentStatusColor(order.paymentStatus)}`}
                              value={order.paymentStatus}
                              onChange={(e) => handlePaymentStatusChange(order._id, e)}
                            >
                              {paymentStatuses.map(ps => (
                                <option key={ps} value={ps} className="bg-zinc-900">{ps}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => navigate(`/admin/dashboard/edit-order/${order._id}`)}
                                className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-900/30"
                                title="Edit order"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(order._id)}
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/30"
                                title="Delete order"
                              >
                                <MdDeleteOutline />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
};
export default Orders