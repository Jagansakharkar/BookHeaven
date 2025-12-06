
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';
import { BsBoxSeam, BsCreditCard } from 'react-icons/bs';
import Loader from '../../Components/common/Loader';
import BackButton from '../../Components/common/BackButton';
import { useGetOrderHistory } from '../../hooks/Order';

const UserOrderHistory = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetOrderHistory()

  const orders = data || [];

  if (isLoading) {
    return <div><Loader /></div>
  }
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'Cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'COD':
        return <FiDollarSign className="text-gray-400" />;
      default:
        return <BsCreditCard className="text-blue-400" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/profile" text="Back to Profile" />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Order History</h1>
          <div className="flex items-center gap-2 text-gray-500">
            <FiPackage className="text-xl" />
            <span>{orders?.length || 0} Orders</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BsBoxSeam className="text-gray-400 text-6xl" />
            </div>
            <h2 className="text-2xl font-medium text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button
              onClick={() => navigate('/books')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-4 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">
                <div className="col-span-1">Order #</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Items</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Payment</div>
              </div>
              {orders.map((order, index) => (
                order.books.map((bookItem, idx) => (
                  <div
                    key={bookItem._id}
                    onClick={() => navigate(`/profile/trackOrder/${order._id}/${bookItem.bookid?._id}`)}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="col-span-1 flex items-center text-gray-900 font-medium">
                      #{index + 1}.{idx + 1}
                    </div>
                    <div className="col-span-2 flex items-center text-gray-600">
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="col-span-3 flex items-center">
                      <img
                        src={bookItem.bookid?.url}
                        alt={bookItem.bookid?.title}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                    </div>
                    <div className="col-span-2 flex items-center font-medium">
                      ₹{bookItem.price.toFixed(2)}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`${order.status === 'Delivered' ? 'text-green-600' :
                        order.status === 'Cancelled' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-gray-600">
                      {getPaymentIcon(order.paymentMethod)}
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory