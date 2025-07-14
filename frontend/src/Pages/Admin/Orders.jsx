import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdDeleteOutline } from "react-icons/md";
import { BackButton } from '../../Components/common/BackButton';

import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Orders = () => {
  const navigate = useNavigate();
  const { token, userid } = useSelector(state => state.auth);

  const [orders, setOrders] = useState([]);
  const [originalOrders, setOriginalOrders] = useState([]);

  const headers = {
    userid,
    Authorization: `Bearer ${token}`,
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/order/get-all-orders', { headers });
      setOrders(res.data.data);
      setOriginalOrders(res.data.data);
    } catch (err) {
      Swal.fire({ icon: 'error', text: `Failed to fetch orders: ${err.message}` });
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (orderid) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This order will be deleted permanently!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:3000/api/admin/order/delete-order/${orderid}`, { headers });
        if (res.data.success) {
          setOrders(prev => prev.filter(o => o._id !== orderid));
          Swal.fire('Deleted!', res.data.message, 'success');
        } else {
          Swal.fire('Error', res.data.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', `Failed to delete order: ${err.message}`, 'error');
      }
    }
  };

  const handleStatusChange = async (orderid, e) => {
    const newStatus = e.target.value;
    try {
      const res = await axios.put(
        `http://localhost:3000/api/admin/order/change-order-status/${orderid}`,
        { status: newStatus },
        { headers }
      );
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderid ? { ...o, status: newStatus } : o));
        Swal.fire({ icon: 'success', text: res.data.message });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', text: `Status update failed: ${err.message}` });
    }
  };

  const handlePaymentStatusChange = async (orderid, e) => {
    const newStatus = e.target.value;
    try {
      const res = await axios.put(
        `http://localhost:3000/api/admin/order/change-payment-status/${orderid}`,
        { paymentStatus: newStatus },
        { headers }
      );
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderid ? { ...o, paymentStatus: newStatus } : o));
        Swal.fire({ icon: 'success', text: res.data.message });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', text: `Payment status update failed: ${err.message}` });
    }
  };

  const allStatuses = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Canceled"];
  const paymentStatuses = ["Pending", "Paid", "Failed"];

  const handleFilter = (status) => {
    if (status === "All") {
      setOrders(originalOrders);
    } else {
      setOrders(originalOrders.filter(o => o.status === status));
    }
  };

  return (
    <div className="p-4 bg-zinc-950 text-white min-h-screen">

      <BackButton to={"/admin/dashboard"} text='Back' />


      <h2 className="text-3xl font-semibold text-zinc-300 mb-6">Orders Management</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={() => handleFilter("All")} className="bg-zinc-700 px-4 py-2 rounded">All</button>
        {allStatuses.map(status => (
          <button key={status} onClick={() => handleFilter(status)} className="bg-zinc-700 px-4 py-2 rounded">
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-zinc-800 text-sm text-white rounded">
          <thead>
            <tr className="bg-zinc-900 sticky top-0 z-10">
              <th className="p-2">#</th>
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Books</th>
              <th className="p-2">Date</th>
              <th className="p-2">Address</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Payment Method</th>
              <th className="p-2">Payment Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="12" className="text-center p-4 text-zinc-400">No orders found.</td></tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id} className="text-center border-b border-zinc-700 hover:bg-zinc-700">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{order._id}</td>
                  <td className="p-2">{order.userid?.fullname || "Unknown"}</td>
                  <td className="p-2 text-left">
                    {order.books.map((b, idx) => (
                      <div key={idx}>{b.title} (x{b.quantity})</div>
                    ))}
                  </td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-2 text-left text-xs">
                    {order.address?.name}<br />
                    {order.address?.street}, {order.address?.city}<br />
                    {order.address?.state} - {order.address?.pincode}<br />
                    📞 {order.address?.phoneno}
                  </td>
                  <td className="p-2">
                    {order.books.reduce((sum, b) => sum + b.quantity, 0)}
                  </td>
                  <td className="p-2">₹{order.totalAmount}</td>
                  <td className="p-2">
                    <select
                      className="bg-zinc-700 px-2 py-1 rounded"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e)}
                    >
                      {allStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">{order.paymentMethod}</td>
                  <td className="p-2">
                    <select
                      className="bg-zinc-700 px-2 py-1 rounded"
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(order._id, e)}
                    >
                      {paymentStatuses.map(ps => (
                        <option key={ps} value={ps}>{ps}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <button onClick={() => navigate(`/admin/dashboard/edit-order/${order._id}`)} className="text-blue-400">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(order._id)} className="text-red-400">
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
