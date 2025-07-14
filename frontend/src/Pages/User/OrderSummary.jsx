import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const OrderSummary = () => {
  const navigate = useNavigate();
  const { orderid } = useParams();
  const { userid, token } = useSelector(state => state.auth);

  const [order, setOrder] = useState(null);

  const headers = {
    userid: userid,
    authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/order/get-order-byId/${orderid}`,
          { headers }
        );

        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderDetails();
  }, [orderid]);

  if (!order) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-zinc-800 text-white shadow-lg p-6 mt-10 rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">🎉 Order Confirmed!</h2>

      <div className="bg-zinc-700 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Details</h3>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod || 'Cash on Delivery'}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString() || 'N/A'}</p>
      </div>

      <div className="bg-zinc-700 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
        {order.address ? (
          <>
            <p><strong>Name:</strong> {order.address.name}</p>
            <p><strong>Phone:</strong> {order.address.phoneno}</p>
            <p><strong>Street:</strong> {order.address.street}</p>
            <p><strong>City:</strong> {order.address.city}</p>
            <p><strong>Pincode:</strong> {order.address.pincode}</p>
          </>
        ) : (
          <p>No address data provided.</p>
        )}
      </div>

      <p className="text-center text-green-400 font-semibold mb-4">
        Thank you for shopping with us!
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
