// ✅ UserOrderHistory.jsx (Frontend)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from '../../Components/common/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';

export const UserOrderHistory = () => {
  const { userid, token } = useSelector(state => state.auth);
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/order/get-user-orders`, { headers });
        setOrders(res.data.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='p-4 text-zinc-100 min-h-[80vh]'>
      <BackButton to={'/profile'} text='Back' />
      <h1 className='text-3xl md:text-4xl font-bold text-zinc-500 mb-6'>Your Order History</h1>

      {orders === null ? (
        <div className='flex items-center justify-center h-[40vh]'><Loader /></div>
      ) : orders.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-zinc-100'>
          <h1 className='text-4xl text-zinc-500 mb-6'>No Order History</h1>
          <img src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png" alt="No orders" className='h-32' />
        </div>
      ) : (
        <>
          <div className='bg-zinc-800 rounded px-4 py-2 flex gap-2 text-sm md:text-base'>
            <div className='w-[5%] text-center'>Sr.No</div>
            <div className='w-[20%] text-center'>Book ID</div>
            <div className='w-[30%] text-center'>Order ID</div>
            <div className='w-[15%] text-center'>Date</div>
            <div className='w-[10%] text-center'>Price</div>
            <div className='w-[10%] text-center'>Status</div>
            <div className='hidden md:block md:w-[10%] text-center'>Mode</div>
          </div>

          {orders.map((order, index) =>
            order.books.map((bookItem, i) => (
              <div
                key={bookItem._id}
                onClick={() => navigate(`/profile/trackOrder/${order._id}/${bookItem.bookid?._id}`)}
                className='bg-zinc-800 hover:bg-zinc-900 rounded px-4 py-2 flex gap-2 text-sm md:text-base cursor-pointer mb-2'
              >
                <div className='w-[5%] text-center'>{index + 1}.{i + 1}</div>
                <div className='w-[20%] text-center'>{bookItem.bookid?._id || "N/A"}</div>
                <div className='w-[30%] text-center'>{order._id}</div>
                <div className='w-[15%] text-center'>{formatDate(order.createdAt)}</div>
                <div className='w-[10%] text-center'>₹{bookItem.price}</div>
                <div className='w-[10%] text-center'>
                  <span className={
                    order.status === "Cancelled" ? 'text-red-500' :
                      order.status === "Placed" ? 'text-yellow-500' :
                        'text-green-500'
                  }>
                    {order.status}
                  </span>
                </div>
                <div className='hidden md:block md:w-[10%] text-center'>{order.paymentMethod}</div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};
