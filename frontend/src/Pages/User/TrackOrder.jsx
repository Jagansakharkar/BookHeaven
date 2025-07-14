import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader } from '../../Components/common/Loader';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';

export const TrackOrder = () => {
  const { orderid, bookid } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { userid, token } = useSelector(state => state.auth);
  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/order/track-order/${orderid}`, {
          params: { bookid },
          headers,
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderid, bookid]);

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><Loader /></div>;
  if (!order) return <div className="text-center text-red-500 mt-10">Order not found.</div>;

  const steps = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStep = steps.indexOf(order.data.itemStatus);

  return (
    <div className="p-6 text-zinc-100">
      <BackButton to={-1} text='Back' />

      <h1 className="text-3xl font-bold mb-4 text-center">Track Your Order</h1>
      <div className="bg-zinc-800 p-4 rounded shadow-md">

        {/* Book Info */}
        <Link to={`/view-book-details/${order.data.book._id}`}>
          <h2 className="text-xl mb-2 font-semibold">Book: {order.data.book.title}</h2>
        </Link>
        <p className="text-sm mb-4 text-zinc-400">Tracking ID: {order.trackingId}</p>

        {/* Address Info */}
        <div className="mb-4">
          <h3 className="font-semibold">Shipping Address</h3>
          <p>{order.address?.name}</p>
          <p>{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
          <p>Phone: {order.address?.phoneno}</p>
        </div>

        {/* Price + Quantity + Date */}
        <p>Price: ₹{order.data.price}</p>
        <p>Quantity: {order.data.quantity}</p>
        <p>Date: {new Date(order.data.createdAt || order.estimatedDelivery || Date.now()).toLocaleDateString()}</p>

        {/* Order Tracker */}
        {currentStep === -1 ? (
          <div className="text-red-500 font-semibold text-lg mt-4">This order has been canceled.</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className={`w-6 h-6 rounded-full ${i <= currentStep ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <p className="text-sm mt-2 text-center">{step}</p>
                {i < steps.length - 1 && (
                  <div className={`h-1 w-full mt-2 ${i < currentStep ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    
    </div>
  );
};
